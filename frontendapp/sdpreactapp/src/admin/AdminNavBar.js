import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './admin.css';

import AdminHome from './AdminHome';
import ChangeAdminPwd from './ChangeAdminPwd';
import ViewStudents from './ViewStudents';
import ViewFacultys from './ViewFacultys';
import ViewFacultyProfile from './ViewFacultyProfile';
import ViewStudentProfile from './ViewStudentProfile';
import AddCourse from './AddCourse';
import MapFacultyToCourse from './MapFacultyToCourse'; // NEW
import AdminTimetable from './AdminTimetable';
import TimetableView from './TimetableView';
import ViewAndUpdateMappedFaculty from './ViewAndUpdateMappedFaculty';

export default function AdminNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('admin');
    navigate('/adminlogin');
    window.location.reload();
  };

  return (
    <div>
      <nav className="admin-navbar">
        <ul className="nav-list">
          <li><Link to="/adminhome">Home</Link></li>
          <li><Link to="/changeadminpwd">Change Password</Link></li>
          <li><Link to="/viewstudents">View Students</Link></li>
          <li><Link to="/viewfacultys">View Facultys</Link></li>
          <li><Link to="/addcourse">Add Course</Link></li>
           <li className="dropdown">
                      <Link>faculty Mapping</Link>
                      <div className="dropdown-content">
       <li><Link to="/mapfaculty">Map Faculty to Course</Link></li> {/* NEW */}
                       <li><Link to="/viewandupdatemappedfaculty">View And Update Faculty to Course</Link></li> {/* NEW */}
                      </div>
                    </li>
         
          <li className="dropdown">
                      <Link>Time Table</Link>
                      <div className="dropdown-content">
                      <li><Link to="/admintimetable">Add Time Table</Link></li>
                      <li><Link to="/timetableview">View Time Table</Link></li>

                      </div>
                    </li>
          
          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/adminhome" Component={AdminHome} exact />
        <Route path="/changeadminpwd" element={<ChangeAdminPwd />} exact />
        <Route path="/viewstudents" Component={ViewStudents} exact />
        <Route path="/viewfacultys" Component={ViewFacultys} exact />
        <Route path="/viewfacultyprofile/:email" element={<ViewFacultyProfile />} exact />
        <Route path="/viewstudentprofile/:email" element={<ViewStudentProfile />} exact />
        <Route path="/addcourse" Component={AddCourse} exact />
        <Route path="/mapfaculty" element={<MapFacultyToCourse />} exact /> {/* NEW */}
        <Route path="/admintimetable" element={<AdminTimetable/>} exact/>
        <Route path="/timetableview" element={<TimetableView/>} exact/> 
        <Route path="/viewandupdatemappedfaculty" element={<ViewAndUpdateMappedFaculty/>} exact/> 

      </Routes>
    </div>
  );
}
