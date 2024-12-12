// Import necessary libraries
const express = require("express");
const dotenv = require('dotenv');
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For token-based authentication
const router = express.Router();
dotenv.config();
//using the port in environmental variable or 5000


// Helper constants
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
}

// Register user
router.post("/register", async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if user already exists
        const [existingUser] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_TABLENAME} WHERE email = ?`,
            [email]
        );
        if (existingUser[0].count > 0) {
            return res.status(409).send('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [insertResults] = await req.pool.query(
            `INSERT INTO ${process.env.DB_TABLENAME} (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
            [name, email, phone, hashedPassword, role]
        );

        res.status(201).json({ id: insertResults.insertId, name, email, phone, role });
    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).send("Internal server error");
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        // Find user by email
        const [user] = await req.pool.query(
            `SELECT * FROM ${process.env.DB_TABLENAME} WHERE email = ?`,
            [email]
        );

        if (user.length === 0) {
            return res.status(404).send("User not found");
        }

        const userData = user[0];

        // Compare passwords
        const validPassword = await bcrypt.compare(password, userData.password);
        if (!validPassword) {
            return res.status(401).send('Invalid password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: userData.id, email: userData.email, role: userData.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).send("Internal server error");
    }
});

// Logout user (frontend clears token, no backend action needed)
router.post("/logout", (req, res) => {
    res.status(200).send("Logged out successfully");
});

// Get all users
router.get("/", authenticateToken, async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_TABLENAME}`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
});

// Create new user
router.post("/", authenticateToken, async (req, res) => {
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone || !role) {
        return res.status(400).send('All fields are required');
    }

    try {
        const [insertResults] = await req.pool.query(
            `INSERT INTO ${process.env.DB_TABLENAME} (name, email, phone, role) VALUES (?, ?, ?, ?)`,
            [name, email, phone, role]
        );
        res.status(201).json({ id: insertResults.insertId, name, email, phone, role });
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).send("Internal server error");
    }
});

// Update user
router.put("/", authenticateToken, async (req, res) => {
    const { id, name, email, phone, role } = req.body;

    if (!id || !name || !email || !phone || !role) {
        return res.status(400).send('All fields are required');
    }

    try {
        const [updateResults] = await req.pool.query(
            `UPDATE ${process.env.DB_TABLENAME} SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?`,
            [name, email, phone, role, id]
        );
        res.status(200).json({ id, name, email, phone, role });
    } catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).send("Internal server error");
    }
});

// Delete user
router.delete("/", authenticateToken, async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('User ID is required');
    }

    try {
        await req.pool.query(`DELETE FROM ${process.env.DB_TABLENAME} WHERE id = ?`, [id]);
        res.status(200).send(`User with ID ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).send("Internal server error");
    }
});

// Export router
module.exports = router;
