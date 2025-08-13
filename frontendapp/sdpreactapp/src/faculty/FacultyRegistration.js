import React, { useState } from 'react';
import axios from 'axios';

export default function FacultyRegistration() 
{
  //formData state variable is initialized with all required keys and empty values
  const [formData, setFormData] = useState({
    ID:'',
    fullname: '',
    gender: '',
    dateofbirth: '',
    email: '',
    workedat:'',
    password: '',
    location: '',
    contact: ''
  });

  //message state variable
  const [message, setMessage] = useState('');
  //error state variable
  const [error, setError] = useState('');

  const handleChange = (e) => 
  {
    setFormData({...formData, [e.target.id]: e.target.value});
    
    // It updates the state `formData` by adding or updating a property with a key equal to 
    //the ID of the input field 
    //that triggered the change event (e.target.id). The value of this property is 
    //set to the new value entered in that input field (e.target.value).
  };

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    try 
    {
      const response = await axios.post('https://reactproject-5xke.onrender.com/insertfaculty', formData);
      if (response.status === 200) 
      {
        setFormData({
            ID:'',
          fullname: '',
          gender: '',
          dateofbirth: '',
          email: '',
          workedat:'',
          password: '',
          location: '',
          contact: ''
        });
      }
      setMessage(response.data);
      setError('') // set error to ""
    } 
    catch (error) 
    {
      setError(error.response.data);
      setMessage(''); //set message to ""
    }
  };
  
  
  return (
    <div>
      <h3 align="center"><u>Faculty Registration</u></h3>
      {
        message ? <h4 align="center">{message}</h4> : <h4 align="center">{error}</h4>
      }

      <form onSubmit={handleSubmit}>
        <div>
        <label>Faculty ID</label>
          <input type="text" id="ID" value={formData.ID} onChange={handleChange} required />
          <label>Full Name</label>
          <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} required />
        </div>
        <div>
          <label>Gender</label>
          <select id="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" id="dateofbirth" value={formData.dateofbirth} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Worked AT</label>
          <input type="workedat" id="workedat" value={formData.workedat} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Location</label>
          <input type="text" id="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact</label>
          <input type="text" id="contact" pattern="[6789][0-9]{9}" placeholder="MUST be 10 Digits" value={formData.contact} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
