const mongoose = require("mongoose");

const registeredSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  courseno: { type: String, required: true, lowercase: true, trim: true },
  coursename: { type: String, required: true },
  modes: { type: String, required: true, enum: ['Regular', 'Advanced'] },
  l: { type: String, required: true, enum: ['s11','s12','s21','s22','s31','s32'] },
  t: { type: String, required: true, enum: ['s11','s12','s21','s22','s31','s32'] },
  p: { type: String, required: true, enum: ['s11','s12','s21','s22','s31','s32'] },
  s: { type: String, required: true, enum: ['s11','s12','s21','s22','s31','s32'] }
}, { timestamps: true });

// Prevent duplicate course registration for same student
registeredSchema.index({ studentEmail: 1, courseno: 1 }, { unique: true });

const Registered = mongoose.model('Registered', registeredSchema);
module.exports = Registered;
