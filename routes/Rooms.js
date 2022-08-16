const express = require('express')
const path = require('path')
const router = express.Router()
const Hotel = require('../Models/Hotel')
const Room = require('../Models/Room')

//get
router.get("/rooms", async(req, res) => {
        try {

            let rooms = await Room.find()
            res.status(200).send(rooms);
        } catch (err) {
            res.status(400).send("error getting room")
        }
    })
    //create
router.post("/:hotelid", async(req, res) => {
    console.log("here in room")
    const hotelid = req.params.hotelid
    let room = new Room(req.body);

    try {

        let saveroom = await room.save();
        try {
            await Hotel.findByIdAndUpdate(hotelid, { $push: { rooms: saveroom._id }, })
        } catch (err) {
            res.send(err)
        }

        res.status(200).json(saveroom)
    } catch (err) {
        res.status(400).send("error in saving" + err)

    }
})
router.delete("/:id/:hotelid", async(req, res) => {



    try {
        await Room.findByIdAndDelete(req.params.id)
        try {
            await Hotel.findByIdAndUpdate(req.params.hotelid, { $pull: { rooms: req.params.id } })
        } catch (err) {
            res.status(400).send("room is not deleted")
        }
        res.status(200).send("room deleted")
    } catch (err) {
        res.status(400).send("error delete " + err)

    }
})

router.put("/:id", async(req, res) => {



    try {
        let updateroom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateroom)
    } catch (err) {
        res.status(400).send("error update" + err)

    }
})
router.get("/:id", async(req, res) => {
    try {
        let room = await Room.findById(req.params.id);
        res.status(200).json(room)
    } catch (err) {
        res.status(400).send("error  " + err)

    }
})
router.put("/availability/:id", async(req, res) => {
    try {
        await Room.updateOne({ "roomNumbers._id": req.params.id }, {
            $push: {
                "roomNumbers.$.unavailableDates": req.body.dates
            },
        });
        res.status(200).json("Room status has been updated.");
    } catch (err) {
        next(err);
    }
});



module.exports = router