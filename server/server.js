const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { cloudinaryConnect } = require("./config/cloudinaryConfig");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();
require("dotenv").config();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connect = require("./config/db");
connect.connectDB();

// Initialize Cloudinary
// cloudinaryConnect();

// Import routes
const packageRoutes = require("./routes/packageRoutes");
const subPackageRoutes = require("./routes/subPackageRoutes");
const contactRoutes = require("./routes/contactRoutes");
// const enquiryRouter = require("./routes/enquiry");
const userRoutes = require("./routes/userRoutes");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");
const enquiryRoutes = require('./routes/enquiryRoutes');

// Use routes
app.use("/api/packages", packageRoutes);
app.use("/api/subpackages", subPackageRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
// app.use("/api", enquiryRouter);
app.use('/api', enquiryRoutes);

// Error handling middleware must be last
app.use(errorHandlingMiddleware);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage using multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
  },
});

// Set up Multer to use Cloudinary storage
const upload = multer({ storage: storage });

// API endpoint to handle image uploads
const maxCount = 10;
app.post("/upload", upload.array("galleryImages", maxCount), (req, res) => {
  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // Here, you can access the uploaded files with req.files
  console.log(req.files); // Log the files to see the uploaded data
  // Send a response back
  res
    .status(200)
    .json({ message: "Files uploaded successfully!", files: req.files });
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port http://0.0.0.0:${PORT}`);
});
