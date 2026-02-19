const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) =>{
    try {
        const {name, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO employees (name, email, password_hash) Values (?,?,?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({message: 'User registed successfully'});

    } catch (error) {
        if (error.code='ER_DUO_ENTRY'){
            return res.status(400).json({ message: 'Email already exists'})
        }

        res.status(500).json({message: 'Server error', error: error.message});
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query(
            'SELECT * From employees WHERE email = ?', [email]
        );

        if (rows.length === 0 ){
            return res.status(401).json({message : ' Invalid credentials'});
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare( password, user.password_hash);
        
        if( !isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email },
            process.env.JWT_SECRET,
            {expiresIn : '1D'}
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};