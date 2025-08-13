import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css'; // Import the CSS file

export default function ViewStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://reactproject-5xke.onrender.com/viewstudents');
      setStudents(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deletestudent = async (email) => {
    try {
      await axios.delete(`https://reactproject-5xke.onrender.com/deletestudent/${email}`);
      fetchStudents();
    } catch (error) {
      console.error(error.message);
    }
  };

  const viewStudent = (email) => {
    try {
      navigate(`/viewstudentprofile/${email}`);
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Students</h1>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Location</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.ID}</td>
                <td>{student.fullname}</td>
                <td>{student.gender}</td>
                <td>{student.dateofbirth}</td>
                <td>{student.email}</td>
                <td>{student.location}</td>
                <td>{student.contact}</td>
                <td>
                  <button onClick={() => viewStudent(student.email)} className="table-btn">
                    View
                  </button>
                  <button onClick={() => deletestudent(student.email)} className="table-btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Data Not Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
