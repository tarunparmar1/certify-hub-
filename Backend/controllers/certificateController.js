
import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

import Certificate from "../models/Certificate.js";
import Student from "../models/Student.js";
import Template from "../models/Template.js";
import Event from "../models/Event.js";

// Generate certificate when student requests it
export const generateCertificate = async (req, res) => {
  try {
    const { eventId, enrollmentNumber } = req.body;

    // Check event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    
    const student = await Student.findOne({
      event: eventId,
      enrollmentNumber: enrollmentNumber.trim(),
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found in this event",
      });
    }

    // Find latest template
    const template = await Template.findOne({
      event: eventId,
    }).sort({ createdAt: -1 });

    if (!template) {
      return res.status(404).json({
        message: "Certificate template not found",
      });
    }

    if (!template.positions) {
      return res.status(400).json({
        message: "Certificate positions are not saved",
      });
    }

    // Find existing certificate
    let certificate = await Certificate.findOne({
      event: eventId,
      student: student._id,
    });

    // Create Certificate ID only first time
    if (!certificate) {
      const certificateId =
        `CERT-${Date.now()}-${student._id
          .toString()
          .slice(-6)}`;

      certificate = await Certificate.create({
        event: eventId,
        student: student._id,
        certificateId,
      });
    }

    // Download template
    const templateResponse = await axios.get(
      template.fileUrl,
      {
        responseType: "arraybuffer",
      }
    );

    const imageBytes = Buffer.from(
      templateResponse.data
    );

    const pdfDoc = await PDFDocument.create();

    // Embed template
    let image;

    if (
      template.fileUrl.toLowerCase().includes(".jpg") ||
      template.fileUrl.toLowerCase().includes(".jpeg")
    ) {
      image = await pdfDoc.embedJpg(imageBytes);
    } else {
      image = await pdfDoc.embedPng(imageBytes);
    }

    const { width, height } = image.scale(1);

    const page = pdfDoc.addPage([
      width,
      height,
    ]);

    // Draw certificate template
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });

    const font = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

    // Editor size = 800 x 550
    const scaleX = width / 800;
    const scaleY = height / 550;

    /*
      visibleFields controls what is PRINTED.

      Enrollment number is still used for student
      lookup even when visibleFields.enrollment = false.
    */

    // -------------------------
    // NAME
    // -------------------------
    if (
      template.visibleFields?.name !== false &&
      template.positions.name
    ) {
      page.drawText(student.studentName, {
        x:
          template.positions.name.x *
          scaleX,

        y:
          height -
          (template.positions.name.y + 40) *
          scaleY,

        size: 25,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // -------------------------
    // ENROLLMENT NUMBER
    // -------------------------
    if (
      template.visibleFields?.enrollment !== false &&
      template.positions.enrollment
    ) {
      page.drawText(
        `Enrollment: ${student.enrollmentNumber}`,
        {
          x:
            template.positions.enrollment.x *
            scaleX,

          y:
            height -
            (template.positions.enrollment.y + 40) *
            scaleY,

          size: 14,
          font,
          color: rgb(0, 0, 0),
        }
      );
    }

    // -------------------------
    // DATE
    // -------------------------
    if (
      template.visibleFields?.date !== false &&
      template.positions.date
    ) {
      page.drawText(
        new Date(
          certificate.issuedDate
        ).toLocaleDateString(),
        {
          x:
            template.positions.date.x *
            scaleX,

          y:
            height -
            (template.positions.date.y + 40) *
            scaleY,

          size: 14,
          font,
          color: rgb(0, 0, 0),
        }
      );
    }

    // -------------------------
    // CERTIFICATE ID
    // -------------------------
    if (
      template.visibleFields?.certificateId !== false &&
      template.positions.certificateId
    ) {
      page.drawText(
        `Certificate ID: ${certificate.certificateId}`,
        {
          x:
            template.positions.certificateId.x *
            scaleX,

          y:
            height -
            (template.positions.certificateId.y + 40) *
            scaleY,

          size: 12,
          font,
          color: rgb(0, 0, 0),
        }
      );
    }

    // -------------------------
    // QR CODE
    // -------------------------
    if (
      template.visibleFields?.qr !== false &&
      template.positions.qr
    ) {
      const verifyUrl =
        `${process.env.FRONTEND_URL}/verify?id=${certificate.certificateId}`;

      const qrData =
        await QRCode.toDataURL(verifyUrl);

      const qrImage =
        await pdfDoc.embedPng(qrData);

      page.drawImage(qrImage, {
        x:
          template.positions.qr.x *
          scaleX,

        y:
          height -
          (template.positions.qr.y + 70) *
          scaleY,

        width: 70 * scaleX,
        height: 70 * scaleY,
      });
    }

    // Convert PDF
    const pdfBytes = await pdfDoc.save();

    // Send PDF directly to student
    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate.certificateId}.pdf"`
    );

    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error(
      "Generate certificate error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Verify certificate
export const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        valid: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId: id,
    })
      .populate(
        "student",
        "studentName enrollmentNumber"
      )
      .populate("event", "title");

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: "Invalid certificate",
      });
    }

    res.status(200).json({
      valid: true,
      certificate: {
        certificateId:
          certificate.certificateId,

        issuedDate:
          certificate.issuedDate,

        studentName:
          certificate.student.studentName,

        enrollmentNumber:
          certificate.student.enrollmentNumber,

        eventName:
          certificate.event.title,
      },
    });

  } catch (error) {
    console.error(
      "Verify certificate error:",
      error
    );

    res.status(500).json({
      valid: false,
      message: "Server error",
    });
  }
};


// export const verifyCertificate = async (req, res) => {
//   try {
//     const { id } = req.query;

//     if (!id) {
//       return res.status(400).json({
//         valid: false,
//         message: "Certificate ID is required",
//       });
//     }

//     const certificate = await Certificate.findOne({
//       certificateId: id,
//     })
//       .populate("student", "studentName enrollmentNumber")
//       .populate("event", "title");

//     if (!certificate) {
//       return res.status(404).json({
//         valid: false,
//         message: "Invalid certificate",
//       });
//     }

//     res.status(200).json({
//       valid: true,
//       certificate: {
//         certificateId: certificate.certificateId,
//         issuedDate: certificate.issuedDate,
//         studentName: certificate.student.studentName,
//         enrollmentNumber:
//           certificate.student.enrollmentNumber,
//         eventName: certificate.event.title,
//       },
//     });
//   } catch (error) {
//     console.error("Verify certificate error:", error);

//     res.status(500).json({
//       valid: false,
//       message: "Server error",
//     });
//   }
// };