import React, { useEffect, useState } from "react";
import axios from "axios";
import './admin.css';

export default function AdminAddTimetable() {
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [day, setDay] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [courseId, setCourseId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");

  // Fetch courses and faculties
  const fetchOptions = async () => {
    try {
      const courseRes = await axios.get("http://localhost:2004/viewcourses");
      const facultyRes = await axios.get("http://localhost:2004/viewfacultys");
      setCourses(courseRes.data);
      setFaculties(facultyRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  // Submit timetable entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!day || !timeSlot || !courseId || !facultyId || !room) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:2004/timetable", {
        day,
        timeSlot,
        courseId,
        facultyId,
        room
      });

      setMessage(res.data.message + " ✅");

      // Reset form
      setDay("");
      setTimeSlot("");
      setCourseId("");
      setFacultyId("");
      setRoom("");
    } catch (err) {
      setMessage(err.response?.data?.message || "faculty not mapped to that course");
    }
  };

  return (
    <div className="admin-timetable-container">
  <h2>Admin - Create Timetable Entry</h2>
  {message && <p className="admin-timetable-message">{message}</p>}

  <form className="admin-timetable-form" onSubmit={handleSubmit}>
    <select value={day} onChange={(e) => setDay(e.target.value)}>
      <option value="">Select Day</option>
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>

    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
  <option value="">Select hours</option>
  {[
    "1",
    "2",
    "3",
    "4",
    "6",
    "7",
    "8",
    "9"
  ].map((slot) => (
    <option key={slot} value={slot}>{slot}</option>
  ))}
</select>


    <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
      <option value="">Select Course</option>
      {courses.map((c) => (
        <option key={c._id} value={c._id}>
          {c.courseno} - {c.coursename}
        </option>
      ))}
    </select>

    <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
      <option value="">Select Faculty</option>
      {faculties.map((f) => (
        <option key={f._id} value={f._id}>
          {f.name} ({f.email})
        </option>
      ))}
    </select>

    <input
      type="text"
      placeholder="Room Number"
      value={room}
      onChange={(e) => setRoom(e.target.value)}
    />

    <button type="submit" className="admin-timetable-button">
      Create Entry
    </button>
  </form>
</div>

  );
}

