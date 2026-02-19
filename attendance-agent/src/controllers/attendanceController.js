const pool = require('../config/db');

exports.markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!req.file){
            return res.status(400).json({message: 'Photo is required'});
        }

        const imagePath = req.file.path;

        const now = new Date();
        const attendanceDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

        await pool.query(
            `INSERT INTO attendance
            (employee_id, attendance_date, check_in_time, image_path)
            VALUES (?, ?, ?, ?)`,
            [userId, attendanceDate, now, imagePath]
        );

        res.json({
            message: 'Attendance marked sucessfully',
            time: now
        });

    } catch (err) {
        
        if(err.code === 'EU_DP_ENTRY'){
            return res.status(400).json({
                message: 'Attendance already marked for today'
            });
        }

        res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};