const Course = require("../models/Course");
const Registered = require("../models/Registered");
const Student = require("../models/Student");
const Timetable=require("../models/timetable")
// Get all available courses
const viewCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (!courses || courses.length === 0) {
      return res.status(200).send([]);
    }
    res.json(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Register a course for student
const insertCourse = async (req, res) => {
  try {
    let { studentEmail, courseno, l, t, p, s } = req.body;

    if (!studentEmail || !courseno || !l || !t || !p || !s) {
      return res.status(400).send("Missing required fields");
    }

    // Normalize
    studentEmail = studentEmail.toLowerCase().trim();
    courseno = courseno.toLowerCase().trim();

    const course = await Course.findOne({ courseno });
    if (!course) {
      return res.status(404).send("Course not found");
    }

    const exists = await Registered.findOne({ studentEmail, courseno });
    if (exists) {
      return res.status(400).send("You have already registered this course");
    }

    const reg = new Registered({
      studentEmail,
      courseno: course.courseno,
      coursename: course.coursename,
      modes: course.modes,
      l, t, p, s
    });

    await reg.save();
    res.status(200).send("Registered Successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("You have already registered this course");
    }
    res.status(500).send(err.message);
  }
};

// Get all registered courses for a student (with normalization)
const getRegisteredCourses = async (req, res) => {
  try {
    const emailRaw = req.params.email;
    if (!emailRaw) return res.status(400).send("Email required");

    const studentEmail = emailRaw.toLowerCase().trim();
    const regs = await Registered.find({ studentEmail });
    res.json(regs || []);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Insert a student
const insertStudent = async (req, res) => {
  try {
    if (req.body.ID) req.body.ID = req.body.ID.toLowerCase().trim();
    if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();

    const student = new Student(req.body);
    await student.save();
    res.send("Registered Successfully");
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send("Student with given ID/email/contact already exists");
    }
    res.status(500).send(e.message);
  }
};

// Student login
const checkStudentLogin = async (req, res) => {
  try {
    let { ID, email, password } = req.body;
    if ((!ID && !email) || !password) {
      return res.status(400).send("ID or Email and password required");
    }

    const query = {};
    if (email) {
      query.email = email.toLowerCase().trim();
    } else if (ID) {
      query.ID = ID.toLowerCase().trim();
    }
    query.password = password;

    const student = await Student.findOne(query);
    if (!student) {
      return res.status(401).send("Invalid credentials");
    }

    res.json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Get student profile (same as old code)
const studentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) return res.status(200).send("Student not found");
    res.json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (!student) return res.status(200).send("Student not found");

    for (const key in req.body) {
      if (key !== "email" && req.body[key]) {
        student[key] = req.body[key];
      }
    }
    await student.save();
    res.status(200).send("Profile Updated Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};




const getStudentTimetable = async (req, res) => {
  try {
    const { email } = req.params; // now using route param instead of query
    console.log("📩 getStudentTimetable called with email:", email);

    // Step 1: Get registered courses for this student
    const regs = await Registered.find({ studentEmail: email.toLowerCase().trim() });
    console.log("📦 Registered courses:", regs);

    if (!regs || regs.length === 0) {
      return res.status(200).json([]); // just send empty array
    }

    // Step 2: Get course ObjectIds from Course collection
    const courseDocs = await Course.find({
      courseno: { $in: regs.map(r => r.courseno) }
    });
    const courseIds = courseDocs.map(c => c._id);

    // Step 3: Find timetable entries for those courses
    const timetable = await Timetable.find({ course: { $in: courseIds } })
      .populate("course")
      .populate("faculty");

    console.log("📅 Timetable entries found:", timetable);

    res.status(200).json(timetable); // send array directly

  } catch (err) {
    console.error("❌ Error in getStudentTimetable:", err);
    res.status(500).json({ message: "Server error" });
  }
};






module.exports = {
  viewCourses,
  insertCourse,
  getRegisteredCourses,
  insertStudent,
  checkStudentLogin,
  studentProfile,
  updateStudentProfile,
  getStudentTimetable

};
