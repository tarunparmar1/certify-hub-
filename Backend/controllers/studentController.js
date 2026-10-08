import Student from "../models/Student.js";
import Event from "../models/Event.js";
import multer from "multer";
import ExcelJS from "exceljs";
// Add Student
export const createStudent = async (req, res) => {
  try {
    const { eventId, enrollmentNumber, studentName } = req.body;

    const student = await Student.create({
      event: eventId,
      enrollmentNumber,
      studentName,
    });

    await Event.findByIdAndUpdate(eventId, {
      $inc: { totalStudents: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Students of Event
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({
      event: req.params.eventId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload XLSX / CSV

// Upload XLSX file
const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadStudents = [
  upload.single("file"),

  async (req, res) => {
    try {
      // Check file
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an Excel file",
        });
      }

      // Check event ID
      if (!req.body.eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is missing",
        });
      }

      const workbook = new ExcelJS.Workbook();

      // This supports .xlsx files
      await workbook.xlsx.load(req.file.buffer);

      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        return res.status(400).json({
          success: false,
          message: "Excel file is empty",
        });
      }

      // Read column headers
      const headers = {};

      worksheet.getRow(1).eachCell((cell, colNumber) => {
        const header = String(cell.value || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        headers[header] = colNumber;
      });

      console.log("Excel headers:", headers);

      // Find Name column
      const nameColumn =
        headers["name"] ||
        headers["student name"] ||
        headers["studentname"] ||
        headers["student"];

      // Find Enrollment column
      const enrollmentColumn =
        headers["enrollment number"] ||
        headers["enrollment no"] ||
        headers["enrollment no."] ||
        headers["enrollmentnumber"] ||
        headers["enrollment"] ||
        headers["enrollment id"] ||
        headers["enrollmentid"];

      if (!nameColumn || !enrollmentColumn) {
        console.log("Detected headers:", headers);

        return res.status(400).json({
          success: false,
          message:
            "Excel must contain Name and Enrollment Number columns",
        });
      }


      const students = [];

      worksheet.eachRow((row, rowNumber) => {
        // Skip header
        if (rowNumber === 1) return;

        const studentName = row.getCell(nameColumn).value;
        const enrollmentNumber =
          row.getCell(enrollmentColumn).value;

        // Skip empty rows
        if (!studentName || !enrollmentNumber) return;

        students.push({
          event: req.body.eventId,
          studentName: String(studentName).trim(),
          enrollmentNumber: String(enrollmentNumber).trim(),
        });
      });

      // No students
      if (students.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid students found in the file",
        });
      }

      // Save students
      await Student.insertMany(students);

      // Update total students
      await Event.findByIdAndUpdate(req.body.eventId, {
        $inc: {
          totalStudents: students.length,
        },
      });

      res.status(200).json({
        success: true,
        message: `${students.length} students uploaded`,
      });

    } catch (error) {
      console.error("Upload students error:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
];



