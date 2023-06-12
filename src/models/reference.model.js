import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Reference = mongoose.model("Reference", referenceSchema);

export default Reference
