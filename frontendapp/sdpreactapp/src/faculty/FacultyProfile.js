import React, { useEffect, useState } from 'react';
import './faculty.css';

export default function FacultyProfile() {
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    const storedFacultyData = localStorage.getItem('faculty');
    if (storedFacultyData) {
      const parsedFacultyData = JSON.parse(storedFacultyData);
      setFacultyData(parsedFacultyData);
    }
  }, []);

  return (
    <div className="profile-container">
      {facultyData ? (
        <div className="profile-card">
          <h2 className="profile-title">MY PROFILE</h2>
          <div className="profile-info">
            <p><strong>Full Name:</strong> {facultyData.fullname}</p>
            <p><strong>Gender:</strong> {facultyData.gender}</p>
            <p><strong>Date of Birth:</strong> {facultyData.dateofbirth}</p>
            <p><strong>Email:</strong> {facultyData.email}</p>
            <p><strong>Contact:</strong> {facultyData.contact}</p>
          </div>
        </div>
      ) : (
        <p className="no-data">No Faculty Data Found</p>
      )}
    </div>
  );
}
