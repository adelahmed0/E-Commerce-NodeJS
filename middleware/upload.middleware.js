import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "public/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 10,
  },
});

const uploadSingleImage = upload.single("image");
const uploadMultipleImages = upload.array("images", 10);

const getFileUrl = (req, filename) => {
  const protocol = req.protocol; // http or https
  const host = req.get("host"); // localhost:3000 or 127.0.0.1:3000 or your domain name

  return `${protocol}://${host}/public/uploads/${filename}`;
};

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return errorResponse(res, 400, "File size exceeds limit");
      case "LIMIT_FILE_COUNT":
        return errorResponse(res, 400, "Too many files");
      default:
        return errorResponse(res, 500, "Failed to upload file");
    }
  } else if (error) {
    return errorResponse(res, 400, "Failed to upload file", error.message);
  }
  next();
};

export {
  uploadSingleImage,
  uploadMultipleImages,
  getFileUrl,
  handleUploadError,
};
