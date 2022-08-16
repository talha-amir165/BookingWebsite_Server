const express = require('express')

const router = express.Router()
const User = require('../models/User')

const bcrypt = require('bcrypt')

const jwt = require("jsonwebtoken");




router.post('/login', async(req, res) => {

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User Not Registered");
    try {
        var isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) return res.status(400).send("Invalid Password");

        var token = jwt.sign({ _id: user._id, username: user.username, isAdmin: user.isAdmin },
            "qwertyzxcvbnmlkjhg"
        );
        // const { password, isAdmin, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).send(token);
    } catch (err) {
        res.send(err);
    }

    //     

    //     res.status(201).json({ token: token })
    //     console.log("Logged In")
    //         // res.redirect('/users');
    // } catch (err) {
    //     res.send('error' + err);
    // }
})



router.post('/signup', async(req, res) => {
    /* let user = await User.findOne({ email: req.body.email });
     if (user) return res.status(400).send("User with given Email already exist");*/

    let password;
    try {
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
        console.log("error in password part  " + err)
    }
    let user = new User({
        username: req.body.username,
        email: req.body.email,

        password: password

    });

    console.log("posting")
    try {
        await user.save();

        return res.send("registered");
    } catch (err) {
        res.send("not registered");
    }
})

router.delete("/:id", async(req, res) => {



    try {
        let user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user)
    } catch (err) {
        res.status(400).send("error delete " + err)

    }
})

router.put("/:id", async(req, res) => {



    try {
        console.log("here in put")
        let updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).send(updateUser)
    } catch (err) {
        res.status(400).send("error update" + err)

    }
})
router.get("/users", async(req, res) => {
    try {
        let users = await User.find();
        res.json(users)
    } catch (err) {
        res.send(err);
    }
})


module.exports = router