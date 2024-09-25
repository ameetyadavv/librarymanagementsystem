const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT tokens
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'LibraryDB'
});

// Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// User Registration
app.post('/api/register', async (req, res) => {
    const { name, membership_type, is_admin, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO Users (name, membership_type, is_admin, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, membership_type, is_admin, hashedPassword], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User registered successfully', id: result.insertId });
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE name = ?';
    db.query(sql, [name], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token, user });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(403);
    }
};

// Issuing a Book
app.post('/api/issue', authenticateJWT, (req, res) => {
    const { book_id } = req.body;
    const issueDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 15);

    const sql = 'INSERT INTO Transactions (user_id, book_id, issue_date, return_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [req.user.id, book_id, issueDate, returnDate], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Book issued successfully', transactionId: result.insertId });
    });
});

// Returning a Book
app.post('/api/return', authenticateJWT, (req, res) => {
    const { transaction_id } = req.body;
    const sql = 'UPDATE Transactions SET return_date = NOW() WHERE id = ? AND user_id = ?';
    db.query(sql, [transaction_id, req.user.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ message: 'Book returned successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    });
});

// Paying a Fine
app.post('/api/pay-fine', authenticateJWT, (req, res) => {
    const { transaction_id, finePaid } = req.body;
    const sql = 'UPDATE Transactions SET fine = ?, fine_paid = ? WHERE id = ? AND user_id = ?';
    db.query(sql, [finePaid, true, transaction_id, req.user.id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ message: 'Fine paid successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    });
});

// Updating Membership
app.put('/api/update-membership', authenticateJWT, (req, res) => {
    const { membership_type } = req.body;
    const sql = 'UPDATE Users SET membership_type = ? WHERE id = ?';
    db.query(sql, [membership_type, req.user.id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Membership updated successfully' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
