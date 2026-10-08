
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // Which fields should appear on the certificate
    visibleFields: {
      name: {
        type: Boolean,
        default: true,
      },

      enrollment: {
        type: Boolean,
        default: true,
      },

      date: {
        type: Boolean,
        default: true,
      },

      certificateId: {
        type: Boolean,
        default: true,
      },

      qr: {
        type: Boolean,
        default: true,
      },
    },

    // Position of each certificate field
    positions: {
      name: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },

      enrollment: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },

      date: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },

      certificateId: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },

      qr: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);

export default Template;

