import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './student.css';

export default function UpdateStudentProfile() {
  const [studentData, setStudentData] = useState({
    ID: '',
    fullname: '',
    gender: '',
    dateofbirth: '',
    email: '',
    password: '',
    location: '',
    contact: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [initialStudentData, setInitialStudentData] = useState({});

  useEffect(() => {
    const storedStudentData = localStorage.getItem('student');
    if (storedStudentData) {
      const parsedStudentData = JSON.parse(storedStudentData);
      setStudentData(parsedStudentData);
      setInitialStudentData(parsedStudentData); // Store initial job seeker data
    }
  }, []);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    try 
    {
      const updatedData = {};
      for (const key in studentData) {
        if (studentData[key] !== initialStudentData[key] && initialStudentData[key] !== '') {
          updatedData[key] = studentData[key]; 
        }
      }
      if (Object.keys(updatedData).length !== 0) {
        // There are changes
        updatedData.email = studentData.email;
        const response = await axios.put('https://reactproject-5xke.onrender.com/updatestudentprofile', updatedData);
        setMessage(response.data);
        setError('');
        const res = await axios.get(`https://reactproject-5xke.onrender.com/studentprofile/${studentData.email}`, updatedData)
         localStorage.setItem("student",JSON.stringify(res.data))
      } else {
        // No changes
        setMessage("No Changes in Student Profile");
        setError("");
      }
    } 
    catch (error) {
      setError(error.response.data);
      setMessage('');
    }
  };
  
  
  return (
    <div>
      <h3 align="center"><u>Update Profile</u></h3>
      {message ? <h4 align="center">{message}</h4> : <h4 align="center" color='red'>{error}</h4>}
      <form onSubmit={handleSubmit}>
         <div>
          <label>ID</label>
          <input type="text" id="ID" value={studentData.ID} readOnly />
        </div>
        <div>
          <label>Full Name</label>
          <input type="text" id="fullname" value={studentData.fullname} onChange={handleChange} required />
        </div>
        <div>
          <label>Gender</label>
          <input type="text" id="gender" value={studentData.gender} readOnly />
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" id="dateofbirth" value={studentData.dateofbirth} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" id="email" value={studentData.email} readOnly />
        </div>
        <div>
          <label>Password</label>
          <input type="password" id="password" value={studentData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Location</label>
          <input type="text" id="location" value={studentData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact</label>
          <input type="number" id="contact" value={studentData.contact} onChange={handleChange} required />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}