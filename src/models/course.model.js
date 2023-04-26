import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course
