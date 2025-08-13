import React from "react";
import "./style.css";

export default function About() {
  return (
    <div className="contact-container">
      <h2 className="page-title">Academic Student Course Registration System</h2>
      <p className="intro-text">
        The Academic Student Course Registration System is a web-based application
        designed to streamline the process of course registration for students in
        an academic institution. It serves as a centralized platform where
        students can view available courses, select their preferred courses, and
        register for the upcoming semester. The system aims to simplify course
        enrolment, prevent scheduling conflicts, and ensure that students have
        access to the courses they need to progress in their academic journey.
      </p>

      <h3 className="roles-title">Roles:</h3><br></br>
      

      <div className="card-container">
        <div className="role-card">
          <h2>Admin Module</h2>
          <p>
            Admins are like the managers of the system. They handle important
            behind-the-scenes tasks:
            <ul>
              <li>Manage user accounts.</li>
              <li>Approve new student/faculty accounts.</li>
              <li>Create, update, or remove courses.</li>
              <li>Assign faculty to courses.</li>
              <li>Manage academic calendar and timetable.</li>
            </ul>
          </p>
        </div>

        <div className="role-card">
          <h2>Student Module</h2>
          <p>
            Students use the system to pick the classes they want:
            <ul>
              <li>Student registration and login.</li>
              <li>Explore available courseswith details (code, title, credits, faculty).</li>
              <li>Register courses.</li>
              <li>View personal timetable.</li>
              <li>Track registered courses.</li>
            </ul>
          </p>
        </div>

        <div className="role-card">
          <h2>Faculty Module</h2>
          <p>
            Teachers manage the courses they teach:
            <ul>
              <li>Faculty registration and login.</li>
              <li>Add or update courses they teach.</li>
              <li>View list of enrolled students.</li>
              <li>Manage course schedules and class timings.</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
