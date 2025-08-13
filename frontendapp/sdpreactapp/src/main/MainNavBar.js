import React from 'react'
import {Routes,Route,Link} from 'react-router-dom'
import Home from './Home'
import About from './About'
import './style.css'
import StudentLogin from './../student/StudentLogin';
import FacultyRegistration from '../faculty/FacultyRegistration'
import Contact from './Contact';
import AdminLogin from './../admin/AdminLogin';
import FacultyLogin from '../faculty/FacultyLogin'
import StudentRegistration from './../student/StudentRegistration'

export default function MainNavBar({ onAdminLogin,onFacultyLogin,onStudentLogin}) 
{
  return (
    <div>
       
       <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li className="dropdown">
                <Link>Registration</Link>
            <div className="dropdown-content">
            <li><Link to="/studentregistration">Student Registration</Link></li>
            <li><Link to="/facultyregistration">Faculty Registration</Link></li>
            </div>
            </li>
            <li className="dropdown">
                <Link>Login</Link>
            <div className="dropdown-content">
            <Link to="/studentLogin">Student Login</Link>
            <Link to="/adminlogin">Admin Login</Link>
            <Link to="/facultylogin">Faculty Login</Link>
            </div>
            </li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>
        </nav>


     <Routes>
        <Route path="/" element={<Home/>} exact/>
        <Route path="/about" element={<About/>} exact/>
        <Route path="/studentregistration" element={<StudentRegistration/>} exact/>
        <Route path="/facultyregistration" element={<FacultyRegistration/>} exact/>
        <Route path="/studentlogin" element={<StudentLogin onStudentLogin={onStudentLogin}/>} exact/>
        <Route path="/adminlogin" element={<AdminLogin onAdminLogin={onAdminLogin}/>} exact/>
        <Route path="/facultylogin" element={<FacultyLogin onFacultyLogin={onFacultyLogin}/>} exact/>
        <Route path="/contact" element={<Contact/>} exact/>
     </Routes>

    </div>
  );
}

