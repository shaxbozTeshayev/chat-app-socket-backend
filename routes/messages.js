const mongoose = require('mongoose');
const { Message } = require('../model/message');

const router = require('express').Router();

// get all messages via conversationId
router.get("/:conversationId", async (req, res) => {
    try {
        const msgs = await Message.find({ conversationId: req.params.conversationId }).populate('sender', ["username"]);
        res.status(200).json(msgs);
    } catch (error) {
        res.status(500).json(error)
    }
})

// create new messages
router.post("/:senderId", async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.senderId) && mongoose.Types.ObjectId.isValid(req.body.sender)) {
        if (req.params.senderId === req.body.sender) {
            try {
                const response = new Message(req.body);
                res.status(200).json(await (await response.save()).populate('sender', ["username"]));
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(500).json("Sending error");
        }
    } else {
        res.status(500).json("Sending error");
    }
});

module.exports = router;