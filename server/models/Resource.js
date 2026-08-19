import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Seminar Hall",
        "Computer Lab",
        "Physics Lab",
        "Chemistry Lab",
        "Smart Classroom",
        "Projector",
        "Auditorium",
        "Sports Ground",
        "Classroom",
        "Meeting Room",
      ],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    location: {
      type: String,
      default: "",
    },

    buildingName: {
      type: String,
      default: "",
    },

    floorNumber: {
      type: Number,
      default: 0,
    },

    roomNumber: {
      type: String,
      default: "",
    },

    facilities: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "08:00",
    },

    closingTime: {
      type: String,
      default: "18:00",
    },

    maxDuration: {
      type: Number,
      default: 8,
    },

    approvalRequired: {
      type: Boolean,
      default: true,
    },

    allowedUsers: {
      type: [String],
      default: ["student", "faculty", "admin"],
    },

    status: {
      type: String,
      enum: ["Available", "Maintenance", "Unavailable"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;