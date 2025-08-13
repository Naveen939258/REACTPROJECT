import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './admin.css';

export default function ViewFacultyProfile() {
  const [facultyData, setFacultyData] = useState(null);
  const { email } = useParams();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get(`https://reactproject-5xke.onrender.com/viewfacultyprofile/${email}`);
        setFacultyData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (email) {
      fetchFacultyData();
    }
  }, [email]);

  if (!email) {
    return null;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Faculty Profile</h2>
      {facultyData ? (
        <div className="profile-card">
          <p><strong>Full Name:</strong> {facultyData.fullname}</p>
          <p><strong>Gender:</strong> {facultyData.gender}</p>
          <p><strong>Date of Birth:</strong> {facultyData.dateofbirth}</p>
          <p><strong>Email:</strong> {facultyData.email}</p>
          <p><strong>Location:</strong> {facultyData.location}</p>
          <p><strong>Contact:</strong> {facultyData.contact}</p>
        </div>
      ) : (
        <p className="loading-text">No Faculty Data Found</p>
      )}
    </div>
  );
}
