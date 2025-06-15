import multer from "multer"
// multer middleware for handling file uploads
// This middleware will save the uploaded files to a temporary directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
    // Set the filename to the current timestamp and original name
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

 export const upload = multer({ storage });


