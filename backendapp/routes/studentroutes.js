const express = require("express");
const studentcontroller = require("../controllers/studentcontroller");
const studentrouter = express.Router();

studentrouter.post("/insertstudent", studentcontroller.insertStudent);
studentrouter.post("/checkstudentlogin", studentcontroller.checkStudentLogin);
studentrouter.get("/viewcourses", studentcontroller.viewCourses);
studentrouter.post("/insertcourse", studentcontroller.insertCourse);

// Use email instead of studentId
studentrouter.get("/studentprofile/:email", studentcontroller.studentProfile);
studentrouter.get("/registeredcourses/:email", studentcontroller.getRegisteredCourses);

studentrouter.put("/updatestudentprofile", studentcontroller.updateStudentProfile);
studentrouter.get("/student/timetable/:email", studentcontroller.getStudentTimetable);

module.exports = studentrouter;
