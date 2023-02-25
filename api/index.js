const express = require('express')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User.js');
const CookieParser = require('cookie-parser');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const e = require('express');


const app = express();

const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = 'fdgd8749y4393rufj8rterdx4865tdg'

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);

//Way to test requests
// app.get('/test', (req,res) => {
//     res.json('test ok');
// });

//Database username joshuagamboa001
//Database password epVwzZg9TQdE5Ys0

app.post('/register', async (req,res) => {
    const {name,email,password} = req.body;
try {
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    })
    res.json(userDoc);
} catch (e) {
    res.status(422).json(e);
}
    
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email})
    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
            jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            })
        } else {
            res.json('password not ok')
        }
    } else {
        res.json('not found')
    }
})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const {name,email,_id} = await User.findById(userData.id)
            res.json({name,email,_id})
        })
    }else {
        res.json(null);
    }
    
})

app.listen(4000);