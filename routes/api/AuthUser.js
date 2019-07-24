const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

router.post(
  "/",

  async (req, res) => {
    
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "Invalid Credentials - please try again" }]
          });
      }

      if (!user.confirmed) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "please register your email before logging in" }]
          });
      }

      
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "Invalid Credentials - please try again" }]
          });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      console.log(payload)

      jwt.sign(
        payload,
        process.env.JTWSECRET,

        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
      console.log(err)
    }
  }
);

router.post(
  "/forgot",

  async (req, res) => {
    
    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "Invalid Credentials - please try again" }]
          });
      }

      if (!user.confirmed) {
        return res
          .status(400)
          .json({
            errors: [{ msg: "please register your email before logging in" }]
          });
      }

      // send the email password
      
      
      const payload = {
        user: {
          email: email
        }
      };

      console.log(payload)

      jwt.sign(
        payload,
        process.env.PASSWORD_SECRET,

        { expiresIn: 3600 },
        (err, passwordToken) => {
          if (err) throw err;
          
          const url = `http://localhost:5000/api/authUser/forgot/${passwordToken}`;

          transporter.sendMail({
            to: user.email,
            subject: "Password Reset",
            html: `Please click this email to reset your email password: <a href="${url}">${url}</a>`
          });
          res.json("an password reset email has been sent");
          console.log("email sent");
          
          
          ;
        }
      );
    } catch (err) {
      res.status(500).send("Server error");
      console.log(err)
    }
  }
);

router.get('/forgot/:password_token', async(req,res)=>{
  try{
    console.log(req.params.password_token)
    const decoded = jwt.verify(req.params.password_token, process.env.PASSWORD_SECRET)
    console.log(decoded)
    
   
    res.send('jwt verified')
}catch (e) {
    console.log(e)
    res.send('error');
  }
})

router.post('/forgot/:password_token', async(req,res)=>{
  const {password} = req.body     
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const decoded = jwt.verify(req.params.password_token, process.env.PASSWORD_SECRET)
  try{
        
    
    const updatedUser = await User.findOneAndUpdate({email: decoded.user.email}, {password: hashedPassword}, {new:true})
    console.log(updatedUser)
    res.send(updatedUser)
}catch (e) {
    console.log(e)
    res.send('error');
  }
})

module.exports = router;