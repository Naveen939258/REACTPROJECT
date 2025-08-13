import React from 'react'
import { Route, Routes, Link , useNavigate} from 'react-router-dom'
import './student.css'
import StudentHome from './StudentHome';
import StudentCourse from './StudentCourse';
import StudentProfile from './StudentProfile';
import UpdateStudentProfile from './UpdateStudentProfile';
import StudentRegisteredCourses from './StudentRegisteredCourses'; // ✅ import
import StudentTimeTable from './StudentTimeTable';

export default function StudentNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('student');
    navigate('/studentlogin');
    window.location.reload()
  };

  return (
    <div>
      <nav>
        <ul>
          <Link to="/studenthome">Home</Link>
          <li className="dropdown">
            <Link>Profile</Link>
            <div className="dropdown-content">
              <Link to="/studentprofile">View Profile</Link>
              <Link to="/updatestudentprofile">Update Profile</Link>
            </div>
          </li>
          <Link to="/studentcourse">Academic Registration</Link>
          <Link to="/registeredcourses">My Courses</Link> {/* ✅ new link */}
          <Link to="/studenttimetable">My Time Table</Link>
          <li><button className="logoutButton" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/studenthome" element={<StudentHome/>} />
        <Route path="/studentprofile" element={<StudentProfile/>} />
        <Route path="/updatestudentprofile" element={<UpdateStudentProfile/>} />
        <Route path="/studentcourse" element={<StudentCourse/>} />
        <Route path="/registeredcourses" element={<StudentRegisteredCourses/>} /> {/* ✅ new route */}
        <Route path="/studenttimetable" element={<StudentTimeTable/>} />
      </Routes>
    </div>
  )
}
