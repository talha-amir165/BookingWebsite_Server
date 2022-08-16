const express = require('express')
const path = require('path')
const router = express.Router()
const Hotel = require('../Models/Hotel')
const Room = require("../Models/Room")

//get
router.get("/", async(req, res) => {
        const { min, max, ...others } = req.query
        try {
            let hotels = await Hotel.find({
                ...others,
                cheapestPrice: { $gt: min | 1, $lte: max || 999 },

            }).limit(req.query.limit)
            res.status(200).json(hotels);
        } catch (err) {
            res.status(400).send("error getting hotel name")
        }
    })
    //create
router.post("/", async(req, res) => {

    let hotel = new Hotel(req.body);

    try {
        await hotel.save();
        res.json(hotel)
    } catch (err) {
        res.status(400).send("error in saving")

    }
})
router.delete("/:id", async(req, res) => {



    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).send("hotel deleted")
    } catch (err) {
        res.status(400).send("error delete " + err)

    }
})

router.put("/:id", async(req, res) => {



    try {
        let updateHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateHotel)
    } catch (err) {
        res.status(400).send("error update" + err)

    }
})
router.get("/find/:id", async(req, res) => {
    try {
        let hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel)
    } catch (err) {
        res.status(400).send("error  " + err)

    }
})
router.get("/room/:id", async(req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const list = await Promise.all(
            hotel.rooms.map((room) => {
                return Room.findById(room);
            })
        );
        res.status(200).json(list)
    } catch (err) {
        next(err);
    }

})
router.get("/countByCity", async(req, res) => {
    const listofcity = req.query.cities.split(",");
    try {
        const list = await Promise.all(listofcity.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)

    } catch (err) {
        res.send("eror in county by cities" + err)
    }
})

router.get("/countByType", async(req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });

        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartments", count: apartmentCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ]);
    } catch (err) {
        next(err);
    }
});



module.exports = router