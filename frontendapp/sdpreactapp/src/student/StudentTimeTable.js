import React, { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function StudentTimeTable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentEmail = (localStorage.getItem("studentEmail") || "").trim().toLowerCase();

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = [1, 2, 3, 4, 5, 6, 7, 8]; // adjust if needed

  useEffect(() => {
    if (!studentEmail) {
      setError("No student email found. Please log in again.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:2004/student/timetable/${studentEmail}`)
      .then((res) => {
        setTimetable(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching timetable:", err);
        setError("Failed to load timetable. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [studentEmail]);

  if (loading) return <h3 style={{ textAlign: "center", color: "orange" }}>LOADING YOUR TIMETABLE...</h3>;
  if (error) return <h3 style={{ textAlign: "center", color: "red" }}>{error}</h3>;

  // Group data by day and timeSlot
  const grouped = {};
  dayOrder.forEach((day) => {
    grouped[day] = {};
    timeSlots.forEach((slot) => {
      grouped[day][slot] = null;
    });
  });

  timetable.forEach((entry) => {
    const day = entry.day?.charAt(0).toUpperCase() + entry.day?.slice(1).toLowerCase();
    const slot = parseInt(entry.timeSlot);
    if (grouped[day] && grouped[day][slot] !== undefined) {
      grouped[day][slot] = `${entry.course?.coursename || "N/A"} - ${entry.faculty?.fullname || "N/A"} - ${entry.room || "N/A"}`;
    }
  });

  return (
    <div className="timetable-container">
      <h2>📅 Your Timetable</h2>
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            {timeSlots.map((slot) => (
              <th key={slot}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayOrder.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {timeSlots.map((slot) => (
                <td key={slot}>
                  {grouped[day][slot] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
