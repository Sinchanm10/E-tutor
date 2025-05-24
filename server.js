const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3019;

// Middleware
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Database
mongoose.connect('mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    Fullname: String,
    Email: { type: String, unique: true },
    Password: String
});
const User = mongoose.model("User", userSchema);

// Routes
app.get('/', (req, res) => res.redirect('/login'));

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ Email: email });
        
        if (!user) {
            return res.status(400).send('<script>alert("User not found"); window.location.href="/login";</script>');
        }

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(400).send('<script>alert("Invalid password"); window.location.href="/login";</script>');
        }

        req.session.userId = user._id;
        res.redirect('http://localhost:5000');
    } catch (error) {
        res.status(500).send('<script>alert("Server error"); window.location.href="/login";</script>');
    }
});

// Signup
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'signup.html'));
});

app.post('/post', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ Email: email });
        if (existingUser) {
            return res.status(400).send('<script>alert("Email already exists"); window.location.href="/signup";</script>');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            Fullname: name,
            Email: email,
            Password: hashedPassword
        });

        await newUser.save();
        res.send('<script>alert("Registration successful!"); window.location.href="/login";</script>');
    } catch (error) {
        res.status(500).send('<script>alert("Registration failed"); window.location.href="/signup";</script>');
    }
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));