require("dotenv").config(); // Add this at the very top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dburl = process.env.MONGO_URI; // Use env variable
mongoose.connect(dburl)
  .then(() => {
    console.log("Connected to MongoDB Atlas Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json()); 
app.use(cors());

const adminrouter = require("./routes/adminroutes");
const studentrouter = require("./routes/studentroutes");
const facultyrouter = require("./routes/facultyroutes");

app.use("", adminrouter);
app.use("", studentrouter);
app.use("", facultyrouter);

app.get("/healthz", (_, res) => res.send("ok"));

const port = process.env.PORT || 2004; // Dynamic port for Render
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
