import React, { useState } from 'react';
import './student.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentLogin({ onStudentLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://reactproject-5xke.onrender.com/checkstudentlogin', formData);

      if (response.status === 200 && response.data) {
        onStudentLogin && onStudentLogin();

        // store full student object
        localStorage.setItem('student', JSON.stringify(response.data));

        // store normalized studentEmail
        if (response.data.email) {
          localStorage.setItem('studentEmail', response.data.email.trim().toLowerCase());
        }

        navigate("/studenthome");
      } else {
        setMessage("Login Failed");
        setError("");
      }
    } catch (err) {
      setMessage("");
      setError(err.response?.data || err.message || "Login failed");
    }
  };

  return (
    <div>
      <h3 align="center"><u>Student Login</u></h3>
      {message 
        ? <h4 align="center" style={{color: 'green'}}>{message}</h4> 
        : <h4 align="center" style={{color: 'red'}}>{error}</h4>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
}
