const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { verifyToken } = require('../middleware/authMiddleware');
const { markAttendance } = require('../controllers/attendanceController');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

//Proteced Route
router.post('/mark', verifyToken, upload.single('photo'), markAttendance);

module.exports = router;