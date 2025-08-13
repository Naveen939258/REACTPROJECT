import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

export default function AdminHome() {
  const [adminData, setAdminData] = useState("");
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedAdminData = localStorage.getItem('admin');
    if (storedAdminData) {
      const parsedAdminData = JSON.parse(storedAdminData);
      setAdminData(parsedAdminData);
      fetchCounts();
    }
  }, []);

  const fetchCounts = async () => {
    try {
      const response = await axios.get(`http://localhost:2004/analysis`);
      setCounts(response.data);
    } catch (error) {
      setError('Failed to fetch counts');
    }
  };

  return (
    <div className="admin-home-container">
      {adminData && (
        <>
          <h2 className="welcome-text">Welcome, {adminData.username}</h2>

          {counts ? (
            <div className="card-grid">
              <div className="info-card">
                <h3 className="faculty-title">Faculties</h3>
                <p className="count">{counts.facultyCount}</p>
              </div>

              <div className="info-card">
                <h3>Students</h3>
                <p className="count">{counts.studentCount}</p>
              </div>
            </div>
          ) : (
            <p className="loading-text">Loading counts...</p>
          )}

          {error && <p className="error-text">{error}</p>}
        </>
      )}
    </div>
  );
}
