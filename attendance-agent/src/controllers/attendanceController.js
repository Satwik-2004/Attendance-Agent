const pool = require('../config/db');

exports.markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!req.file){
            return res.status(400).json({message: 'Photo is required'});
        }

        const { latitude, longitude} = req.body;

        if(!latitude || !longitude){
            return res.status(400).json({message: 'Location is required'});
        }

        const imagePath = req.file.path;

        const now = new Date();
        const attendanceDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

        await pool.query(
            `INSERT INTO attendance
            (employee_id, attendance_date, check_in_time, image_path, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, attendanceDate, now, imagePath, latitude, longitude]
        );

        res.json({
            message: 'Attendance marked sucessfully',
            time: now,
            location: { latitude, longitude}
        });



    } catch (err) {
        
        if(err.code === 'EU_DUP_ENTRY'){
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