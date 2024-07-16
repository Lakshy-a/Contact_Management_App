const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, "PLease add the user name"],
    },
    email: {
        type: String,
        required: [true, "PLease add the email"],
        unique: [true, "Email address already taken"],
    },
    password: {
        type: String,
        required: [true, "PLease add the password"],
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("USER", userSchema);