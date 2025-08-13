import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin.css"; // to use the unified styles

export default function ViewFacultys() {
  const navigate = useNavigate();
  const [facultys, setFacultys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFacultys = async () => {
    try {
      const response = await axios.get("http://localhost:2004/viewfacultys");
      setFacultys(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultys();
  }, []);

  const deleteFaculty = async (email) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await axios.delete(`http://localhost:2004/deletefaculty/${email}`);
      fetchFacultys();
    } catch (error) {
      console.error("Error deleting faculty:", error.message);
    }
  };

  const viewFaculty = (email) => {
    navigate(`/viewfacultyprofile/${email}`);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Faculty List</h1>

      {loading ? (
        <p className="loading-text">Loading faculties...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Worked At</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(facultys) && facultys.length > 0 ? (
              facultys.map((faculty, index) => (
                <tr key={index}>
                  <td>{faculty.ID}</td>
                  <td>{faculty.fullname}</td>
                  <td>{faculty.gender}</td>
                  <td>{faculty.dateofbirth}</td>
                  <td>{faculty.email}</td>
                  <td>{faculty.workedat}</td>
                  <td>{faculty.location}</td>
                  <td>{faculty.contact}</td>
                  <td>
                    <button
                      onClick={() => viewFaculty(faculty.email)}
                      className="table-btn"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteFaculty(faculty.email)}
                      className="table-btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No faculty records found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
