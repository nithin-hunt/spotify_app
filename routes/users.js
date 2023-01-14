const router = require('express').Router();
const User = require('../models/userModel');
const validate = require('../utils/validators');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Signup user
router.post("/signup", async (req,res) => {
    try{
        const {error} = validate(req.body);
        if(error){
            return res.status(400).json({message: error.details[0].message});
        }

        const user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(403).json({ message: "User with given email already Exist!" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, (saltOrRounds = 10));
        let newUser = await new User({
            ...req.body,
            password: hashedPassword,
        }).save();

        newUser.password = undefined;
        newUser.__v = undefined;

        res.status(200).json({ data: newUser, message: "Account created successfully" });
    } catch (e) {
        return res.status(400).send(e);
    }
});

// Signin user
router.post("/signin", async(req,res) => {
    try {
        const {email,password} = req.body;
        if(email.length === 0) {
            return res.status(400).json({Message: "Please provide email"});
        }
        if(password.length === 0) {
            return res.status(400).json({Message: "Please provide password"});
        }

        const user = await User.findOne({ email: email});
        if (!user) {
            return res.status(400).json({Message: "Invalid email or password"});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(400).json({Message: "Invalid email or password"});
        }

        const payload = { _id: user._id, name: user.name };
        const bearerToken = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {expiresIn: "7d",});

        res.cookie('t', bearerToken, {expire: new Date() + 9999});

        return res.status(200).json({ message: "Signed In Successfully!", bearerToken: bearerToken });



    } catch (e) {
        return res.status(400).send(e);
    }
})

module.exports = router;