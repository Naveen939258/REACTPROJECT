import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";  // make sure this path matches your CSS location

export default function ViewAndUpdateMappedFaculty() {
  const [mappings, setMappings] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editMappingId, setEditMappingId] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load mapped data
  useEffect(() => {
    fetchMappings();
    fetchFaculties();
    fetchCourses();
  }, []);

  const fetchMappings = () => {
    axios.get("http://localhost:2004/viewmappedfaculty")
      .then(res => setMappings(res.data))
      .catch(() => setMappings([]));
  };

  const fetchFaculties = () => {
    axios.get("http://localhost:2004/viewfacultys")
      .then(res => setFaculties(res.data))
      .catch(() => setFaculties([]));
  };

  const fetchCourses = () => {
    axios.get("http://localhost:2004/viewcourses")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  };

  const startEdit = (mapping) => {
    setEditMappingId(mapping._id);
    setSelectedFaculty(mapping.facultyId._id);
    setSelectedCourse(mapping.courseId._id);
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setEditMappingId(null);
    setSelectedFaculty("");
    setSelectedCourse("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedFaculty || !selectedCourse) {
      setError("Please select both faculty and course");
      return;
    }

    axios.put(`http://localhost:2004/updatemappedfaculty/${editMappingId}`, {
      facultyId: selectedFaculty,
      courseId: selectedCourse
    })
      .then(res => {
        setMessage(res.data);
        cancelEdit();
        fetchMappings();
      })
      .catch(err => {
        setError(err.response?.data || "Error updating mapping");
      });
  };

  return (
    <div className="container">
      <h3>Mapped Faculties to Courses</h3>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}

      {mappings.length === 0 ? (
        <p>No mappings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Faculty Email</th>
              <th>Course No</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map(mapping => (
              <tr key={mapping._id}>
                <td>{mapping.facultyId?.fullname || mapping.facultyId?.name}</td>
                <td>{mapping.facultyId?.email}</td>
                <td>{mapping.courseId?.courseno}</td>
                <td>{mapping.courseId?.coursename}</td>
                <td>
                  <button onClick={() => startEdit(mapping)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editMappingId && (
        <form onSubmit={handleUpdate} style={{ marginTop: "20px" }}>
          <h2>Update Mapping</h2>
          <label>
            Faculty:
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name || f.fullname} ({f.email})
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Course:
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>
                  {c.courseno} - {c.coursename}
                </option>
              ))}
            </select>
          </label>
          <br />
          <button type="submit">Update</button>
          <button type="button" onClick={cancelEdit}>Cancel</button>
        </form>
      )}
    </div>
  );
}
