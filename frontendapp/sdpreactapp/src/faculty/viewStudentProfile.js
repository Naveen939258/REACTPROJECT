import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './faculty.css';

export default function ViewStudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const { email } = useParams();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:2004/viewstudentprofile/${email}`);
        setStudentData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (email) {
      fetchStudentData();
    }
  }, [email]);

  if (!email) {
    return null;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Student Profile</h2>
      {studentData ? (
        <div className="profile-card">
          <p><strong>Full Name:</strong> {studentData.fullname}</p>
          <p><strong>Gender:</strong> {studentData.gender}</p>
          <p><strong>Date of Birth:</strong> {studentData.dateofbirth}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Location:</strong> {studentData.location}</p>
          <p><strong>Contact:</strong> {studentData.contact}</p>
        </div>
      ) : (
        <p className="loading-text">No Student Data Found</p>
      )}
    </div>
  );
}
