import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

export default function MapFacultyToCourse() {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Faculties
  useEffect(() => {
    axios.get("http://localhost:2004/viewfacultys")
      .then(res => {
        if (Array.isArray(res.data)) setFaculties(res.data);
      })
      .catch(err => console.error("Error fetching faculties:", err));
  }, []);

  // Fetch Courses
  useEffect(() => {
    axios.get("http://localhost:2004/viewcourses")
      .then(res => {
        if (Array.isArray(res.data)) setCourses(res.data);
      })
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  const handleMapping = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedFaculty || !selectedCourse) {
      setError("Please select both faculty and course");
      return;
    }

    axios.post("http://localhost:2004/mapfaculty", {
      facultyId: selectedFaculty,
      courseId: selectedCourse
    })
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        setError(err.response?.data || "Error mapping faculty to course");
      });
  };

  return (
    <div className="map-container">
      <h3 align="center"><u>Map Faculty to Course</u></h3>
      {message && <h4 align="center" style={{ color: "green" }}>{message}</h4>}
      {error && <h4 align="center" style={{ color: "red" }}>{error}</h4>}

      <form onSubmit={handleMapping}>
        <div className="form-group">
          <label>Faculty</label>
          <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} required>
            <option value="">Select Faculty</option>
            {faculties.map(faculty => (
              <option key={faculty._id} value={faculty._id}>
                {faculty.name} ({faculty.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseno} - {course.coursename}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="map-btn">Map</button>
      </form>
    </div>
  );
}
