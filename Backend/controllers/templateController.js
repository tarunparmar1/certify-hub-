import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Template from "../models/Template.js";



const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadTemplate = [
  upload.single("file"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      console.log("File:", req.file.originalname);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "certificate-templates",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });


      const template = await Template.create({
        event: req.body.eventId,
        fileUrl: result.secure_url,

        visibleFields: {
          name: true,
          enrollment: true,
          date: true,
          certificateId: true,
          qr: true,
        },
      });


      res.status(201).json({
        success: true,
        message: "Template uploaded successfully",
        template,
      });

    } catch (error) {
      console.error("Template upload error:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
];
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({
      event: req.params.eventId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePositions = async (req, res) => {
  try {
    const { eventId, positions, visibleFields } = req.body;

    const template = await Template.findOneAndUpdate(
      { event: eventId },
      {
        positions,
        visibleFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      message: "Certificate changes saved successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

