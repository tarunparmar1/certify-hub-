import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
    },

    issuedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;