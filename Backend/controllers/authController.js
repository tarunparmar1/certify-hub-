import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Register Admin
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({
      email: cleanEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      // admin: {
      //   id: admin._id,
      //   name: admin.name,
      //   email: admin.email,
      // },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // console.log("Login email:", cleanEmail);

    // Find admin
    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    // console.log("Admin found:", !!admin);

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    // console.log("Password correct:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      // token,
      // admin: {
      //   id: admin._id,
      //   name: admin.name,
      //   email: admin.email,
      // },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Current Admin
export const getCurrentAdmin = async (req, res) => {
  try {
    res.status(200).json({
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};