const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array
    }
}, { timestamps: true, collection: "Conversation" });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = { Conversation };