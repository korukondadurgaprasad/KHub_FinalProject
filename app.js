const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path'); // Node.js module for working with file and directory paths

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username, password });
        if (foundUser) {
            // Redirect to final.html upon successful login
            res.sendFile(path.join(__dirname, '/views/final.html'));
        } else {
            res.send('Invalid username or password');
        }
    } catch (err) {
        console.log(err);
        res.send('Error occurred');
    }
});

app.post('/register', async (req, res) => {
    const { username, password, email, name } = req.body;

    const newUser = new User({
        username,
        password,
        email,
        name,
    });

    try {
        await newUser.save();
        res.send('Registration successful');
    } catch (err) {
        console.log(err);
        res.send('Error occurred');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
