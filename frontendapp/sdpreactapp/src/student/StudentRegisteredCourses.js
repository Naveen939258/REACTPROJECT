import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentRegisteredCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get student email from localStorage
  const studentEmail = (localStorage.getItem("studentEmail") || "").trim().toLowerCase();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`https://reactproject-5xke.onrender.com/registeredcourses/${studentEmail}`);
        setCourses(res.data || []);
      } catch (error) {
        console.error("Error fetching registered courses", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentEmail) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [studentEmail]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="registered-courses-container">
      <h2 className="registered-courses-title">My Registered Courses</h2>
      {courses.length === 0 ? (
        <p>No courses registered yet.</p>
      ) : (
        <table className="registered-courses-table">
          <thead>
            <tr>
              <th>Course No</th>
              <th>Course Name</th>
              <th>Mode</th>
              <th>L</th>
              <th>T</th>
              <th>P</th>
              <th>S</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseno}</td>
                <td>{course.coursename}</td>
                <td>{course.modes}</td>
                <td>{course.l}</td>
                <td>{course.t}</td>
                <td>{course.p}</td>
                <td>{course.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
