// models/FacultyCourseMapping.js
const mongoose = require('mongoose');

const facultyCourseMappingSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'faculty', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true }
}, { timestamps: true });

// prevent duplicates
facultyCourseMappingSchema.index({ facultyId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('FacultyCourseMapping', facultyCourseMappingSchema);
