const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

// get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

// saveuser in mongodb
router.post("/", async (req, res) => {
    try {
        const newUser = new User(req.body);
        const response = await newUser.save();
        let token = jwt.sign({ ...response._doc }, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;