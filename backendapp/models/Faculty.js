const mongoose = require("mongoose")

const facultyschema = new mongoose.Schema({
    ID:{
       type:String,
       required:true,
       unique: true
    },
    fullname: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required:true,
      enum: ['male', 'female', 'others']
    },
    dateofbirth: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    workedat:
    {
      type:String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      default:"klef1234"
    },
    location: {
      type: String,
      required: true
    },
    contact: {
        type: String,
        required: true,
        unique:true
      },
  });

const faculty= mongoose.model('faculty',facultyschema);

module.exports = faculty;