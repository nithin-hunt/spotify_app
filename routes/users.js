const router = require('express').Router();
const User = require('../models/userModel');
const {validateUser} = require('../utils/validators');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Signup user
router.post("/signup", async (req,res) => {
    try{
        const {error} = validateUser(req.body);
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
        return res.status(500).send(e);
    }
});

// Login user
router.post("/login", async(req,res) => {
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

        return res.status(200).json({ message: "Logged in successfully!", bearerToken: bearerToken });

    } catch (e) {
        return res.status(500).send(e);
    }
})

// Logout user
router.get("/logout", (req,res) => {
    try {
        res.clearCookie('t');
        return res.status(200).json({ message: "Logged out successfully!" });
    } catch (e) {
        return res.status(500).send(e);
    }
})

router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!validateEmail(email)) {
        return res.status(403).send("please enter valid email");
      }
  
      const userExists = await User.findOne({ email });
  
      if (!userExists) {
        return res.status(404).send("User not found");
      }
  
      const payload = { userID: userExists.userID };
      const forgotToken = await jwt.sign(payload, process.env.SECRET, {
        expiresIn: 360000,
      });
  
      const resetLink = `${process.env.APP_URL}/api/v1/user/forgot-password/${forgotToken}`;
  
      const mailOptions = {
        from: "shubhamrakhecha5@gmail.com",
        to: email,
        cc: [],
        bcc: [],
        subject: "password reset",
        html: `<h1>Want to change your password right??</h1><p>If you send this request then click on reset password to reset your password or just ignore it</p><a href="${resetLink}">reset password</a>`,
      };
  
      Transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email sended with=", info);
        }
      });
  
      return res.status(200).send("email sent sucessfully");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  });

module.exports = router;