const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to read users
function readUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, '[]');
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users file:", error);
        return [];
    }
}

// Helper function to write users
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Success
        res.json({ success: true, role: user.role, message: "Login successful!" });
    } else {
        // Failed
        res.status(401).json({ success: false, message: "Account not found or invalid credentials." });
    }
});

// Signup Endpoint
app.post('/api/signup', (req, res) => {
    const { username, email, password, gender } = req.body;
    const users = readUsers();

    // Check for duplicates
    const isDuplicate = users.some(u => u.username === username || u.email === email);
    if (isDuplicate) {
        return res.status(400).json({ success: false, message: "Username or Email already exists." });
    }

    // Determine Avatar Color based on Gender
    let avatarColor = "#ffffff"; // Default white
    if (gender === "female") {
        avatarColor = "#ffb6c1"; // Pink / Rose
    } else if (gender === "male") {
        avatarColor = "#add8e6"; // Light Blue
    }

    // Determine Avatar Letter
    const avatarLetter = username.charAt(0).toUpperCase();

    // Create new user object
    const newUser = {
        username,
        email,
        password,
        gender, // female, male, not-say
        role: "user", // Normal user
        avatarColor,
        avatarLetter
    };

    // Save to file
    users.push(newUser);
    writeUsers(users);

    res.json({ success: true, message: "Account created successfully!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Please make sure to run: npm install express cors body-parser`);
});
