const Student = require("../models/Student")
const Faculty = require("../models/Faculty")
const Course = require("../models/Course")
const Admin=require("../models/Admin");
const Timetable = require("../models/timetable");
const mongoose = require("mongoose");

 const viewstudents = async (request, response) => 
 {
    try 
    {
      const students= await Student.find();
      if(students.length==0)
      {
        response.send("DATA NOT FOUND");
      }
      else
      {
        response.json(students);
      }
    } 
    catch (error) 
    {
      response.status(500).send(error.message);
    }
  };
  const deletestudent = async (request, response) => 
 {
    try 
    {
      const email = request.params.email
      const student= await Student.findOne({"email":email})
      if(student!=null)
      {
        await Student.deleteOne({"email":email})
        response.send("Deleted Successfully")
      }
      else
      {
        response.send("Email ID Not Found")
      }

    } 
    catch (error) 
    {
      response.status(500).send(error.message);
    }
  };
  const viewfacultys = async (request, response) => 
  {
     try 
     {
       const facultys= await Faculty.find();
       if(facultys.length==0)
       {
         response.send("DATA NOT FOUND");
       }
       else
       {
         response.json(facultys);
       }
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };
   const deletefaculty= async (request, response) => 
  {
     try 
     {
       const email = request.params.email
       const faculty= await Faculty.findOne({"email":email})
       if(faculty!=null)
       {
         await Faculty.deleteOne({"email":email})
         response.send("Deleted Successfully")
       }
       else
       {
         response.send("Email ID Not Found")
       }
 
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };

  const checkadminlogin = async (request, response) => 
  {
     try 
     {
       const input = request.body
       console.log(input)
       const admin = await Admin.findOne(input)
       response.json(admin)
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };
  const addcourse = async (req, res) => {
  try {
    if (req.body.courseno) req.body.courseno = req.body.courseno.toLowerCase().trim();
    if (req.body.coursename) req.body.coursename = req.body.coursename.trim();

    const existing = await Course.findOne({ courseno: req.body.courseno });
    if (existing) {
      return res.status(400).send("Course with this Course No already exists");
    }

    const course = new Course(req.body);
    await course.save();
    res.send("Course Registered Successfully");
  } catch (e) {
    res.status(500).send(e.message);
  }
};


  const analysis = async (req, res) => {
    try 
    {
        const facultyCount = await Faculty.countDocuments();
        const studentCount = await Student.countDocuments();
        res.json({facultyCount,studentCount});
    } 
    catch (error) 
    {
        res.status(500).send(error.message);
    }
  };
  const viewfacultyprofile = async (request, response) => 
  {
     try 
     {
       const email = request.params.email
       const faculty = await Faculty.findOne({email})
       if(faculty)
       {
         response.json(faculty)
       }
       else
       {
         return response.status(200).send('Faculty not found with the provided email id');
       }
       
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };
   const viewstudentprofile = async (request, response) => 
  {
     try 
     {
       const email = request.params.email
       const student = await Student.findOne({email})
       if(student)
       {
         response.json(student)
       }
       else
       {
         return response.status(200).send('Student not found with the provided email id');
       }
       
     } 
     catch (error) 
     {
       response.status(500).send(error.message);
     }
   };
   const changeadminpwd = async (request, response) => {
    try 
    {
      const { username, oldpassword, newpassword } = request.body;

      const admin = await Admin.findOne({ username, password: oldpassword });
      
       if (!admin) 
      {
        response.status(400).send('Invalid Old Password');
      }
      else
      {
          if(oldpassword==newpassword)
          {
            response.status(400).send('Both Passwords are Same');
          }
          else
          {
            await Admin.updateOne({username},{ $set: { password: newpassword } });
             response.json('Password Updated Successfully');
          }
        
      }
    } 
    catch (error) 
    {
      response.status(500).send(error.message);
    }
  };
const FacultyCourseMapping = require("../models/FacultyCourseMapping");

const mapFacultyToCourse = async (req, res) => {
  try {
    const { facultyId, courseId } = req.body;

    if (!facultyId || !courseId) {
      return res.status(400).send("Faculty ID and Course ID are required");
    }

    // Check if mapping already exists
    const existingMapping = await FacultyCourseMapping.findOne({ facultyId, courseId });
    if (existingMapping) {
      return res.status(400).send("This faculty is already assigned to this course");
    }

    const mapping = new FacultyCourseMapping({ facultyId, courseId });
    await mapping.save();

    res.send("Faculty mapped to course successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const viewcourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses.length === 0) {
      res.send("DATA NOT FOUND");
    } else {
      res.json(courses);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const createTimetableEntry = async (req, res) => {
  try {
    const { day, timeSlot, courseId, facultyId, room } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).send("Invalid Course or Faculty ID");
    }

    // Check if mapping exists
    const validMapping = await FacultyCourseMapping.findOne({ facultyId, courseId });
    if (!validMapping) {
      return res.status(400).send("Faculty is not assigned to the selected course");
    }

    const entry = new Timetable({
      day,
      timeSlot,
      course: courseId,
      faculty: facultyId,
      room
    });

    await entry.save();

    // Optionally send updated timetable
    const updatedTimetable = await Timetable.find()
      .populate("course", "coursename courseno")
      .populate({ path: "faculty", model: "faculty", select: "fullname email" });

    res.status(201).json({ message: "Timetable entry created", timetable: updatedTimetable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getTimetableById = async (req, res) => {
  try {
    const entryId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({ message: "Invalid Timetable Entry ID" });
    }

    const entry = await Timetable.findById(entryId)
      .populate("course", "coursename courseno")
      .populate({ path: "faculty", model: "faculty", select: "fullname email" });

    if (!entry) return res.status(404).json({ message: "Timetable entry not found" });

    res.json(entry);
  } catch (err) {
    console.error("Error fetching timetable entry:", err);
    res.status(500).json({ message: "Failed to fetch timetable entry" });
  }
};

// UPDATE timetable entry (already present in your code, but include/replace with this cleaned version)
const updateTimetableEntry = async (req, res) => {
  try {
    const entryId = req.params.id;
    const { day, timeSlot, courseId, facultyId, room } = req.body;

    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return res.status(400).json({ message: "Invalid Timetable Entry ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ message: "Invalid Course or Faculty ID" });
    }

    // Optional: check if mapping exists (if you require faculty-course mapping)
    const validMapping = await FacultyCourseMapping.findOne({ facultyId, courseId });
    if (!validMapping) {
      return res.status(400).json({ message: "Faculty is not assigned to the selected course" });
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      entryId,
      { day, timeSlot, course: courseId, faculty: facultyId, room },
      { new: true }
    )
      .populate("course", "coursename courseno")
      .populate({ path: "faculty", model: "faculty", select: "fullname email" });

    if (!updatedEntry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    res.status(200).json({ message: "Timetable entry updated successfully", updatedEntry });
  } catch (err) {
    console.error("Error updating timetable:", err);
    res.status(500).json({ message: "Error updating timetable" });
  }
};
const viewMappedFaculty = async (req, res) => {
  try {
    const mappings = await FacultyCourseMapping.find()
      .populate("facultyId", "fullname email")  // populate faculty details
      .populate("courseId", "courseno coursename");  // populate course details

    if (mappings.length === 0) {
      return res.send("No faculty-course mappings found");
    }

    res.json(mappings);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const updateMappedFaculty = async (req, res) => {
  try {
    const mappingId = req.params.id;  // mapping document _id
    const { facultyId, courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(mappingId)) {
      return res.status(400).send("Invalid Mapping ID");
    }
    if (!facultyId || !courseId) {
      return res.status(400).send("Faculty ID and Course ID are required");
    }

    // Check if the new mapping already exists (avoid duplicates)
    const existingMapping = await FacultyCourseMapping.findOne({ facultyId, courseId });
    if (existingMapping && existingMapping._id.toString() !== mappingId) {
      return res.status(400).send("This faculty is already assigned to this course");
    }

    const updated = await FacultyCourseMapping.findByIdAndUpdate(
      mappingId,
      { facultyId, courseId },
      { new: true }
    );

    if (!updated) {
      return res.status(404).send("Mapping not found");
    }

    res.send("Mapping updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getTimetable = async (req, res) => {
  try {
    const entries = await Timetable.find()
      .populate("course", "coursename courseno")
      .populate({ path: "faculty", model: "faculty", select: "fullname email" })



    res.json(entries || []);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ message: "Failed to load timetable. Please try again." });
  }
};


module.exports = {
  viewstudents,
  deletestudent,
  viewfacultys,
  deletefaculty,
  checkadminlogin,
  addcourse,
  viewfacultyprofile,
  analysis,
  viewstudentprofile,
  changeadminpwd,
  mapFacultyToCourse, // <-- add this
  viewcourses,
  createTimetableEntry,
  getTimetableById,
  viewMappedFaculty,
  updateMappedFaculty,
  updateTimetableEntry,
  getTimetable

};
