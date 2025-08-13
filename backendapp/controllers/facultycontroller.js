const Faculty = require("../models/Faculty");
const FacultyCourseMapping = require("../models/FacultyCourseMapping");
const Course = require("../models/Course");
const Registered = require("../models/Registered");
const Timetable = require("../models/timetable");

// Insert new faculty
const insertfaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.send("Registered Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// Login check
const checkfacultylogin = async (req, res) => {
  try {
    const faculty = await Faculty.findOne(req.body);
    res.json(faculty);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Faculty profile
const facultyprofile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.params.email.toLowerCase().trim() });
    if (faculty) {
      res.json(faculty);
    } else {
      res.status(404).send("Faculty not found with the provided email id");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update faculty profile
const updatefacultyprofile = async (req, res) => {
  try {
    const { email, ...updates } = req.body;
    const faculty = await Faculty.findOne({ email: email.toLowerCase().trim() });

    if (!faculty) {
      return res.status(404).send("Faculty not found with the provided email id");
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key]) faculty[key] = updates[key];
    });

    await faculty.save();
    res.send("Faculty Profile Updated Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// Get faculty courses with registered students
const getFacultyCoursesWithStudents = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const result = await FacultyCourseMapping.aggregate([
      { $match: { facultyId: faculty._id } },
      {
        $lookup: {
          from: Course.collection.name,
          localField: "courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      { $unwind: "$courseDetails" },
      {
        $lookup: {
          from: Registered.collection.name,
          localField: "courseDetails.courseno",
          foreignField: "courseno",
          as: "students"
        }
      },
      {
        $project: {
          _id: 0,
          courseno: "$courseDetails.courseno",
          coursename: "$courseDetails.coursename",
          students: {
            $map: {
              input: "$students",
              as: "stu",
              in: { studentEmail: "$$stu.studentEmail" }
            }
          }
        }
      }
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No courses mapped or no students registered" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error fetching faculty courses with students:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get faculty timetable
const getFacultyTimetable = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Faculty email is required" });
    }

    const faculty = await Faculty.findOne({ email: email.toLowerCase().trim() });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const timetable = await Timetable.find({ faculty: faculty._id })
      .populate("course")
      .populate("faculty");

    res.status(200).json(timetable);
  } catch (err) {
    console.error("❌ Error fetching faculty timetable:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  insertfaculty,
  checkfacultylogin,
  facultyprofile,
  updatefacultyprofile,
  getFacultyCoursesWithStudents,
  getFacultyTimetable
};
