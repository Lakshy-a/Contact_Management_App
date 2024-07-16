const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// @desc register a new user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const {
        userName,
        email,
        password
    } = req.body
    if (!userName || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }
    const userAvailable = await User.findOne({
        email
    });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

    // hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const user = await User.create({
        userName,
        email,
        password: hashedPassword,
    });
    console.log(`User Created ${user}`);
    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
    res.json({
        message: "Register the user"
    });
});

// @desc login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }
    const user = await User.findOne({
        email
    });

    // compare password with hashed password
    if (user && (await bcryptjs.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                userName: user.userName,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        });
        res.status(201).json({
            accessToken
        });
    }else{
        res.status(400);
        throw new Error("Email or password is not valid...");
    }
});

// @desc current user
// @route POST /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser
}