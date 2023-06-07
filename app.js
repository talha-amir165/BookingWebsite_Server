const express = require('express')
const mongoose = require('mongoose')

var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true, //access-control-allow-credentials:true
        optionSuccessStatus: 200
    }
    //require('dotenv').config()
require("dotenv").config()
const app = express()
const url = process.env.DATABASE
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json

app.use(bodyParser.json())
app.use(cors(corsOptions));
const DB = 'mongodb+srv://Talha:chakwal112@cluster0.nczsgqj.mongodb.net/BookingWebsite?retryWrites=true&w=majority'



mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,


    })
    .then(() => {
        console.log('Connected to the MongoDB database');
    })
    .catch((error) => {
        console.error('Error connecting to the MongoDB database:', error);
    });
const roomRouter = require('./routes/Rooms')

//app.use(express.json())
const HotelRouter = require('./routes/Hotel')
app.use('/api', HotelRouter)
const authRouter = require('./routes/auth')
app.use('/api/auth', authRouter)
app.get("/", (req, res) => {
    res.send("hello")
})
app.use('/room', roomRouter)


//start local server 
app.listen(process.env.PORT || 5000, () => console.log('service started at http://localhost:5000'))