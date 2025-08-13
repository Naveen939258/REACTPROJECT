import React, { useEffect, useState } from 'react';
import './student.css';

export default function StudentHome() {
  const [studentData, setStudentData] = useState("");

  useEffect(() => {
    const storedStudentData = localStorage.getItem('student');
    if (storedStudentData) {
      const parsedStudentData = JSON.parse(storedStudentData);
      setStudentData(parsedStudentData);
    }
  }, []);

  return (
    <div className="student-home-container">
      {studentData && (
        <div className="student-card">
          <h2 className="student-welcome">Welcome, {studentData.fullname}</h2>
          <p className="student-subtext">We're glad to have you here!</p>
        </div>
      )}
    </div>
  );
}
