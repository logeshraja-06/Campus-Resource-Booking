import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Resource from "./models/Resource.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not found in environment. Please check server/.env file.");
  process.exit(1);
}

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Force clear existing seeded resources and users to ensure a clean state
    await User.deleteMany({ email: { $in: ["admin@campus.edu", "student@campus.edu"] } });
    await Resource.deleteMany({});
    console.log("Cleared existing test users and resources.");

    // 1. Create Admin User
    const adminEmail = "admin@campus.edu";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        fullName: "System Administrator",
        email: adminEmail,
        password: hashedAdminPassword,
        role: "admin",
        department: "Administration",
      });
      console.log(`Created admin user: ${adminEmail} / admin123`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    // 2. Create Student User
    const studentEmail = "student@campus.edu";
    const existingStudent = await User.findOne({ email: studentEmail });
    if (!existingStudent) {
      const hashedStudentPassword = await bcrypt.hash("student123", 10);
      await User.create({
        fullName: "Alex Student",
        email: studentEmail,
        password: hashedStudentPassword,
        role: "student",
        department: "Computer Science",
        year: 3,
      });
      console.log(`Created student user: ${studentEmail} / student123`);
    } else {
      console.log(`Student user already exists: ${studentEmail}`);
    }

    // 3. Create Dummy Resources
    const dummyResources = [
      {
        name: "Advanced Computing Lab 1",
        category: "Computer Lab",
        capacity: 45,
        location: "Ramanujan Block, Floor 2, Room 204",
        buildingName: "Ramanujan Block",
        floorNumber: 2,
        roomNumber: "204",
        facilities: ["Projector", "WiFi", "AC", "Computers"],
        description: "High-end development lab equipped with 45 workstations and Gigabit ethernet.",
        department: "CSE",
        openingTime: "08:00",
        closingTime: "18:00",
        maxDuration: 4,
        approvalRequired: true,
        status: "Available",
        allowedUsers: ["student", "faculty", "admin"],
        image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Main Auditorium",
        category: "Auditorium",
        capacity: 300,
        location: "Admin Block, Floor 1, Room 101",
        buildingName: "Admin Block",
        floorNumber: 1,
        roomNumber: "101",
        facilities: ["Projector", "AC", "WiFi", "Sound System"],
        description: "Central campus auditorium for guest lectures, cultural gatherings, and conferences.",
        department: "General",
        openingTime: "09:00",
        closingTime: "21:00",
        maxDuration: 8,
        approvalRequired: true,
        status: "Available",
        allowedUsers: ["student", "faculty", "admin"],
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Smart Classroom 12",
        category: "Smart Classroom",
        capacity: 60,
        location: "Einstein Block, Floor 1, Room 112",
        buildingName: "Einstein Block",
        floorNumber: 1,
        roomNumber: "112",
        facilities: ["Projector", "Smart Board", "AC", "WiFi", "White Board"],
        description: "Equipped with interactive display panels and hybrid lecture capture setups.",
        department: "ECE",
        openingTime: "08:00",
        closingTime: "17:00",
        maxDuration: 3,
        approvalRequired: false,
        status: "Available",
        allowedUsers: ["student", "faculty", "admin"],
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      }
    ];

    await Resource.create(dummyResources);
    console.log("Added 3 dummy resources to the database successfully!");

    console.log("Seeding complete! Disconnecting...");
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
