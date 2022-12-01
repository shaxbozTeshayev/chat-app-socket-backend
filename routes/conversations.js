const router = require('express').Router();
const { Conversation } = require('../model/conversation');

// new conversation
router.post("/", async (req, res) => {
    const con = await Conversation.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } }) || await Conversation.findOne({ members: { $all: [req.body.receiverId, req.body.senderId] } })

    if (con) {
        res.status(200).json(con);
    } else {
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
        });
        try {
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        } catch (error) {
            res.status(500).json(error);
        }
    }
});

module.exports = router;