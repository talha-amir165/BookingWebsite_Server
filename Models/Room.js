const mongoose = require('mongoose')

const roomsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxpeople: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],

}, { timestamps: true })
module.exports = mongoose.model('Room', roomsSchema)