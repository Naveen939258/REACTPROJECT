const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "faculty", required: true },
  room: { type: String, required: true }
});

module.exports = mongoose.model("Timetable", timetableSchema);
