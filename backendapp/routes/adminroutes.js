const admincontroller = require("../controllers/admincontroller")

const express = require("express")
const adminrouter = express.Router()

// admin routes
adminrouter.get("/viewstudents",admincontroller.viewstudents)
adminrouter.post("/checkadminlogin",admincontroller.checkadminlogin)
adminrouter.delete("/deletestudent/:email",admincontroller.deletestudent)
adminrouter.get("/viewfacultys",admincontroller.viewfacultys)
adminrouter.delete("/deletefaculty",admincontroller.deletefaculty)
adminrouter.post("/addcourse",admincontroller.addcourse)
adminrouter.get("/analysis",admincontroller.analysis)
adminrouter.get("/viewfacultyprofile/:email",admincontroller.viewfacultyprofile)
adminrouter.get("/viewstudentprofile/:email",admincontroller.viewstudentprofile)
adminrouter.post("/mapfaculty", admincontroller.mapFacultyToCourse);
adminrouter.get("/viewcourses", admincontroller.viewcourses);
adminrouter.post("/timetable", admincontroller.createTimetableEntry);
adminrouter.get("/timetable/:id", admincontroller.getTimetableById);
// you already have:
adminrouter.put("/timetable/:id", admincontroller.updateTimetableEntry);
adminrouter.get("/viewmappedfaculty", admincontroller.viewMappedFaculty);
adminrouter.put("/updatemappedfaculty/:id", admincontroller.updateMappedFaculty);
adminrouter.get("/gettimetable", admincontroller.getTimetable);

module.exports = adminrouter