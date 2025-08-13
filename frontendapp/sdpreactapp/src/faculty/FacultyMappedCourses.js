import React, { useEffect, useState } from "react";
import axios from "axios";
import "./faculty.css";
export default function FacultyMappedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get faculty data from localStorage after login
  const faculty = JSON.parse(localStorage.getItem("faculty"));
  const facultyEmail = faculty?.email; // Change to actual field name from backend

  useEffect(() => {
    if (!facultyEmail) {
      setError("Faculty email not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:2004/courseswithstudents/${facultyEmail}`
        );
        setCourses(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [facultyEmail]);

  if (loading) return <p>Loading mapped courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="faculty-courses-container">
    <h2>Courses Mapped to You</h2>
    {courses.length === 0 ? (
      <p className="no-courses">No mapped courses found.</p>
    ) : (
      <table className="courses-table">
        <thead>
          <tr>
            <th>Course No</th>
            <th>Course Name</th>
            <th>Registered Students</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, idx) => (
            <tr key={idx}>
              <td>{course.courseno}</td>
              <td>{course.coursename}</td>
              <td>
                {course.students?.length > 0 ? (
                  <ul className="students-list">
                    {course.students.map((stu, sIdx) => (
                      <li key={sIdx}>{stu.studentEmail}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="no-students">No students registered</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}
