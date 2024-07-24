const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
const port = 3100;


const mongoURI = 'mongodb://localhost:27017/auction-site';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/add-item.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-item.html'));
});

// Define models
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startingBid: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    bidEndTime: { type: Date, required: true }
});

const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(400).json('Invalid credentials');
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json('Error: ' + err);
                }

                if (result) {
                    res.json(user);
                } else {
                    res.status(400).json('Invalid credentials');
                }
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json('Username already exists');
            }
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) return res.status(500).json('Error: ' + err);
                const newUser = new User({ username, password: hash });
                newUser.save()
                    .then(user => res.json(user))
                    .catch(err => res.status(400).json('Error: ' + err));
            });
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/api/add-item', (req, res) => {
    const { name, startingBid, imageUrl, bidEndTime } = req.body;

    // Create a new item
    const newItem = new Item({
        name,
        startingBid,
        imageUrl,
        bidEndTime
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
