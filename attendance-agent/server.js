require('dotenv');
 const express = require('express');
 const cors = require('cors');
 const helmet = require('helmet');
 const morgan = require('morgan');

const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const app  = express();


app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);


(async () =>{
    try {
        await pool.query('SELECT 1');
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed', err);
    }
})();


const Port = process.env.PORT || 5000;

app.listen(Port, () => {
    console.log(`Server runnig on port ${Port}`);
});