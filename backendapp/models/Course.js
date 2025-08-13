const mongoose = require("mongoose")

const courseschema = new mongoose.Schema({
    courseno:{
       type:String,
       required:true,
    },
    coursename: {
      type: String,
      required: true
    },
    modes: {
      type: String,
      required:true,
      enum: ['Regular', 'Advanced']
    },
  });
  
  const course= mongoose.model('course',courseschema);


  module.exports = course;
  