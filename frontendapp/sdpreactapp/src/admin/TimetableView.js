import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

function EditTimetableModal({ entryId, onClose, onSaved, open }) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [form, setForm] = useState({
    day: "",
    timeSlot: "",
    courseId: "",
    facultyId: "",
    room: ""
  });

  useEffect(() => {
    if (!open) return;
    const fetchAll = async () => {
      try {
        const [cRes, fRes, mRes, entryRes] = await Promise.all([
          axios.get("http://localhost:2004/viewcourses").then(r => r.data).catch(() => []),
          axios.get("http://localhost:2004/viewfacultys").then(r => r.data).catch(() => []),
          axios.get("http://localhost:2004/viewmappedfaculty").then(r => r.data).catch(() => []),
          axios.get(`http://localhost:2004/timetable/${entryId}`).then(r => r.data)
        ]);

        setCourses(Array.isArray(cRes) ? cRes : []);
        setFaculties(Array.isArray(fRes) ? fRes : []);
        setMappings(Array.isArray(mRes) ? mRes : []);

        const e = entryRes;
        setForm({
          day: e.day || "",
          timeSlot: e.timeSlot?.toString() || "",
          courseId: e.course?._id || e.course || "",
          facultyId: e.faculty?._id || e.faculty || "",
          room: e.room || ""
        });

        setLoading(false);
      } catch (err) {
        console.error("Modal load error:", err);
        setMessage("Failed to load data for edit");
        setLoading(false);
      }
    };

    fetchAll();
  }, [entryId, open]);

  const filteredFaculties = form.courseId
    ? (mappings || [])
        .filter((m) => {
          const cid = m.courseId?._id ? m.courseId._id : m.courseId;
          return cid && cid.toString() === form.courseId.toString();
        })
        .map((m) => (m.facultyId?.fullname ? m.facultyId : m.facultyId))
        .filter((f, idx, self) => f && idx === self.findIndex(t => t._id === f._id))
    : [];

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.day || !form.timeSlot || !form.courseId || !form.facultyId || !form.room) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:2004/timetable/${entryId}`, {
        day: form.day,
        timeSlot: form.timeSlot,
        courseId: form.courseId,
        facultyId: form.facultyId,
        room: form.room
      });

      setMessage(res.data.message || "Updated successfully");
      if (onSaved) onSaved();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 700);
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.message || "Error updating timetable");
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Edit Timetable Entry</h3>
        {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <select value={form.day} onChange={(e) => handleChange("day", e.target.value)}>
              <option value="">Select Day</option>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={form.timeSlot} onChange={(e) => handleChange("timeSlot", e.target.value)}>
              <option value="">Select Hour</option>
              {[1,2,3,4,5,6,7,8,9].map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={form.courseId} onChange={(e) => { handleChange("courseId", e.target.value); handleChange("facultyId", ""); }}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.courseno} - {c.coursename}</option>)}
            </select>

            <select value={form.facultyId} onChange={(e) => handleChange("facultyId", e.target.value)} disabled={!form.courseId}>
              <option value="">Select Faculty</option>
              {filteredFaculties.length > 0
                ? filteredFaculties.map(f => <option key={f._id} value={f._id}>{f.fullname || f.name} ({f.email})</option>)
                : (faculties || []).map(f => <option key={f._id} value={f._id}>{f.fullname || f.name} ({f.email})</option>)
              }
            </select>

            <input type="text" placeholder="Room" value={form.room} onChange={(e)=>handleChange("room", e.target.value)} />

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button type="submit" className="btn primary">Save</button>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function TimetableView() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const dayOrder = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const timeSlots = [1,2,3,4,5,6,7,8];

  const fetchTimetable = async () => {
    try {
      const res = await axios.get("http://localhost:2004/gettimetable");
      setTimetable(res.data || []);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError("Failed to load timetable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchTimetable(); }, []);

  if (loading) return <h3 style={{ textAlign: "center", color: "orange" }}>Loading timetable...</h3>;
  if (error) return <h3 style={{ textAlign: "center", color: "red" }}>{error}</h3>;

  const grouped = {};
  dayOrder.forEach(d => { grouped[d] = {}; timeSlots.forEach(s => grouped[d][s] = []); });

  timetable.forEach(entry => {
    const day = (entry.day?.charAt(0).toUpperCase() + entry.day?.slice(1).toLowerCase()) || entry.day;
    const slot = parseInt(entry.timeSlot);
    if (grouped[day] && grouped[day][slot] !== undefined) {
      grouped[day][slot].push(entry);
    }
  });

  const onCellClick = (entry) => {
    if (!entry || !entry._id) return;
    setEditingEntryId(entry._id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEntryId(null);
  };

  const handleSaved = () => {
    fetchTimetable();
  };

  return (
    <div className="timetable-container">
      <h2>📅 Timetable</h2>
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            {timeSlots.map(slot => <th key={slot}>{slot}</th>)}
          </tr>
        </thead>
        <tbody>
          {dayOrder.map(day => (
            <tr key={day}>
              <td style={{ fontWeight: 600 }}>{day}</td>
              {timeSlots.map(slot => (
                <td key={slot} className="timetable-cell">
                  {grouped[day][slot].length > 0
                    ? grouped[day][slot].map((entry) => (
                        <div
                          key={entry._id}
                          className="timetable-entry"
                          onClick={() => onCellClick(entry)}
                          style={{ cursor: "pointer", padding: "4px 6px", borderRadius: 4 }}
                          title="Click to edit"
                        >
                          <div style={{ fontWeight: 600 }}>{entry.course?.coursename || "N/A"}</div>
                          <div style={{ fontSize: 12 }}>{entry.faculty?.fullname || entry.faculty?.name || "N/A"}</div>
                          <div style={{ fontSize: 12, opacity: 0.9 }}>{entry.room || "N/A"}</div>
                        </div>
                      ))
                    : <span style={{ opacity: 0.5 }}>-</span>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <EditTimetableModal
        entryId={editingEntryId}
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />
    </div>
  );
}
