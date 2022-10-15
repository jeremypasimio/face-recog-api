require('dotenv').config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const { handleRegister } = require('./controllers/register');
const { handleSignIn } = require('./controllers/signin');
const { handleImage } = require('./controllers/image');
const { getProfile, incrementImage } = require('./controllers/profile');



//knex db connection settings for PostgreS
const db = knex({
    client: 'pg',
    
    //comment out for local dev and testing
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
    
    //un-comment for local dev and testing
    // connection: {
    //     host: '127.0.0.1',
    //     user: 'webdev',
    //     password: process.env.DB_PASS,
    //     database: 'face-recog-users'
    // }
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.json('Server reached');
});

//Route for logging in. Compares hash of entered password to stored hash via bcrypt
app.post('/signin', (req, res) => { handleSignIn(req, res, db, bcrypt) });

//Register a new user
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

//get a user's profile by id
app.get('/profile/:id', (req, res) => { getProfile(req, res, db) });

//processes image through call to Clarifai API
app.post('/process-image', handleImage);

//increment image count on home screen
app.put('/image', (req, res) => { incrementImage(req, res, db) });

//Listen...
app.listen(process.env.PORT || 3030, () => {
    console.log(`Listening on ${process.env.PORT} or 3030`);
});