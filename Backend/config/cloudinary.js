import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

console.log(
  "Cloudinary URL:",
  process.env.CLOUDINARY_URL ? "Loaded" : "Missing"
);

export default cloudinary;