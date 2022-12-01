const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true, collection: "Users" });

const User = mongoose.model("Users", userSchema);

module.exports = { User };