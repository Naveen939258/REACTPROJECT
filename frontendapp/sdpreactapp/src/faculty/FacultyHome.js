import React, { useEffect, useState } from 'react';
import './faculty.css'; // Reusing the same styles for now

export default function FacultyHome() {
  const [facultyData, setFacultyData] = useState("");

  useEffect(() => {
    const storedFacultyData = localStorage.getItem('faculty');
    if (storedFacultyData) {
      const parsedFacultyData = JSON.parse(storedFacultyData);
      setFacultyData(parsedFacultyData);
    }
  }, []);

  return (
    <div className="student-home-container">
      {facultyData && (
        <div className="student-card">
          <h2 className="student-welcome">Welcome, {facultyData.fullname}</h2>
          <p className="student-subtext">Ready to inspire and guide your students today!</p>
        </div>
      )}
    </div>
  );
}
