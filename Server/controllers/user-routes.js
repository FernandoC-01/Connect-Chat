
const express = require("express");
const User = require("../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


//create user endpoint
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try{
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({ err: "Please complete all fields"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ err: "This email is already in use" });
    }

    const saltRounds = parseInt(process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })

    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId: newUser._id})
}catch (err) {
    res.status(500).json({ err: "internal server error" });
}
})

//login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ err: "Please provide email and password" });
        }


        // checking if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ err: "User not found" });
        }


        //verifing credentials
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ err: "Invalid email or password" });
        }
        

        // Generating user JWT 
        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Internal server error" });
    }
});

module.exports = router


// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false }, // Optional, adjust as needed
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
