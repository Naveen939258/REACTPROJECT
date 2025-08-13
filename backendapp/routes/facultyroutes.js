const express = require("express");
const facultycontroller = require("../controllers/facultycontroller");

const facultyrouter = express.Router();

facultyrouter.post("/insertfaculty", facultycontroller.insertfaculty);
facultyrouter.post("/checkfacultylogin", facultycontroller.checkfacultylogin);
facultyrouter.get("/facultyprofile/:email", facultycontroller.facultyprofile);
facultyrouter.put("/updatefacultyprofile", facultycontroller.updatefacultyprofile);
facultyrouter.get("/courseswithstudents/:email", facultycontroller.getFacultyCoursesWithStudents);
facultyrouter.get("/faculty/timetable/:email", facultycontroller.getFacultyTimetable);

module.exports = facultyrouter;
