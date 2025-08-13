import React, { useState } from 'react';
import axios from 'axios';

export default function AddCourse() {
  const [formData, setFormData] = useState({
    courseno: '',
    coursename: '',
    modes: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    let { id, value } = e.target;

    // Normalize course number
    if (id === "courseno") {
      value = value.toLowerCase().trim();
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:2004/addcourse', formData);
      setMessage(res.data); // Success message from backend
      setFormData({ courseno: '', coursename: '', modes: '' });
    } catch (err) {
      setError(err.response?.data || "Error adding course");
    }
  };

  return (
    <div>
      <h3 align="center"><u>Add Courses</u></h3>
      {message && <h4 align="center" style={{ color: "green" }}>{message}</h4>}
      {error && <h4 align="center" style={{ color: "red" }}>{error}</h4>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Course No</label>
          <input
            type="text"
            id="courseno"
            value={formData.courseno}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Course Name</label>
          <input
            type="text"
            id="coursename"
            value={formData.coursename}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Modes</label>
          <select
            id="modes"
            value={formData.modes}
            onChange={handleChange}
            required
          >
            <option value="">Select Modes</option>
            <option value="Regular">Regular</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button type="submit">Add</button>
      </form>
    </div>
  );
}
