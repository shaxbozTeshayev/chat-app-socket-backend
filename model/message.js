const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    text: {
        type: String,
        default: "",
        trim: true
    },
    img: {
        type: String,
        default: "",
    }
}, { timestamps: true, collection: "Message" });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };