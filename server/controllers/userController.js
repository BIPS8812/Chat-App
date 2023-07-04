const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all required fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User with email " + email + " already exists");
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
        name,
        email, 
        password: secPass, 
        pic
    })

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400);
        throw new Error("Failed to create user");
    }
});

module.exports.authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please enter all required fields");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("User with email " + email + " does not exist. Please sign up.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        res.status(400);
        throw new Error("Incorrect Password");
    }
    else {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
});

// /api/user?search=Bipangshu
module.exports.getAllUser = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or : [
            { name: { $regex: req.query.search, $options: 'i' }},
            { email: { $regex: req.query.search, $options: 'i' }},
        ]
    } : {}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.send(users)
});