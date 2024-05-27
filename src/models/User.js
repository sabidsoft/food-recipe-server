const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true
    },

    photoURL: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    
    coin: {
        type: Number,
        default: 50,
    },
}, {
    timestamps: true
})

const User = model("User", userSchema);

module.exports = User;
