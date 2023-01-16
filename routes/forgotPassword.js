const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4,  validate: uuidValidate} = require('uuid');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

//Forgot password functionality
router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
        });
        const {error} = schema.validate({email :req.body.email});
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
  
        const user= await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        const uuid = await uuidv4();
        user.password = uuid;
        await user.save();
        const resetLink = `${process.env.APP_URL}/api/users/forgot-password/${uuid}`;
    
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.body.email,
            cc: [],
            bcc: [],
            subject: "Password Reset",
            html: `<h1>Forgot your password?</h1>
            <p>We recieved a request to reset the password for your account</p>
            <br/>
            <p>copy and paste the URL into your browser</p>
            <a href="${resetLink}">reset password</a>`,
        };
        
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS,
            }
        });

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                return res.status(200).send("Email sent sucessfully");
            }
        });
    
    } catch (e) {
      return res.status(500).json({Error: e.message });
    }
});

router.put("/:uuid", async (req, res) => {
    try {
        if(!uuidValidate(req.params.uuid)) {
            return res.status(404).json("Not authorised to reset password or User not found");
        }
        
        const user = await User.findOne({password: req.params.uuid});
        if(!user){
            return res.status(404).json("User not found");
        }

        const { password } = req.body;
        
        const schema = Joi.object({
            password: passwordComplexity().required(),
        });
        const { error } = schema.validate({password: req.body.password});
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));
    
        user.password = hashedPassword;
        await user.save();
    
        return res.status(200).send("password changed sucessfully");
    } catch (e) {
      return res.status(500).json({ Error: e.message });
    }
  });

module.exports = router;