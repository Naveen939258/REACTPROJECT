import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './student.css';

function StudentCourse() {
  const [courses, setCourses] = useState([]);
  const [ltpsData, setLtpsData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [registeredCoursesSet, setRegisteredCoursesSet] = useState(new Set());

  const ltpsOptions = ['s11', 's12', 's21', 's22', 's31', 's32'];

  // CHANGED: get email from localStorage instead of ID
  const studentEmail = (localStorage.getItem('studentEmail') || '').trim().toLowerCase();

  useEffect(() => {
    axios.get('https://reactproject-5xke.onrender.com/viewcourses')
      .then(res => setCourses(res.data || []))
      .catch(() => setError("Failed to load courses"));

    if (studentEmail) {
      axios.get(`https://reactproject-5xke.onrender.com/registeredcourses/${studentEmail}`)
        .then(res => {
          const regs = res.data || [];
          const set = new Set(regs.map(r => r.courseno.toLowerCase().trim()));
          setRegisteredCoursesSet(set);
        })
        .catch(() => {});
    }
  }, [studentEmail]);

  const handleInputChange = (courseId, field, value) => {
    setLtpsData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value
      }
    }));
  };

  const handleRegister = async (course) => {
    if (!studentEmail) {
      setError("Student email not found. Please log in.");
      return;
    }

    const normalizedCourseno = (course.courseno || '').toLowerCase().trim();
    if (registeredCoursesSet.has(normalizedCourseno)) {
      setError("You have already registered this course");
      setMessage('');
      return;
    }

    const ltps = ltpsData[course._id] || {};
    if (!ltps.l || !ltps.t || !ltps.p || !ltps.s) {
      setError("Please select L, T, P and S options before registering");
      setMessage('');
      return;
    }

    setLoadingCourseId(course._id);
    try {
      const payload = {
        studentEmail,
        courseno: course.courseno,
        coursename: course.coursename,
        modes: course.modes,
        l: ltps.l,
        t: ltps.t,
        p: ltps.p,
        s: ltps.s
      };

      const res = await axios.post('https://reactproject-5xke.onrender.com/insertcourse', payload);

      setMessage(res.data || "Registered Successfully");
      setError('');

      setRegisteredCoursesSet(prev => {
        const copy = new Set(prev);
        copy.add(normalizedCourseno);
        return copy;
      });
    } catch (err) {
      setError(err.response?.data || "Registration failed");
      setMessage('');
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <div className="student-course-container">
      <h1>Course Registration</h1>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      {courses.length === 0 ? (
        <p className="no-courses">No Courses Found</p>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>Course No</th>
              <th>Course Name</th>
              <th>Modes</th>
              <th>L</th>
              <th>T</th>
              <th>P</th>
              <th>S</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => {
              const normalizedCourseno = (course.courseno || '').toLowerCase().trim();
              const isRegistered = registeredCoursesSet.has(normalizedCourseno);

              return (
                <tr key={course._id}>
                  <td>{course.courseno}</td>
                  <td>{course.coursename}</td>
                  <td>{course.modes}</td>

                  {['l', 't', 'p', 's'].map(field => (
                    <td key={field}>
                      <select
                        value={ltpsData[course._id]?.[field] || ''}
                        onChange={(e) => handleInputChange(course._id, field, e.target.value)}
                        disabled={isRegistered}
                      >
                        <option value="">Select</option>
                        {ltpsOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                  ))}

                  <td>
                    {isRegistered ? (
                      <button className="btn registered" disabled>Registered</button>
                    ) : (
                      <button
                        className="btn register"
                        onClick={() => handleRegister(course)}
                        disabled={loadingCourseId === course._id}
                      >
                        {loadingCourseId === course._id ? 'Registering…' : 'Register'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentCourse;
