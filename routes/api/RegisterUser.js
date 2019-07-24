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

//     // async email

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg:
              "A user with that email has already been registered - please use a different email"
          }
        ]
      });
    }
    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log("user saved");
    
      // this will save the user - but the user has not confirmed email address

    // now im about to send the email;
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.EMAIL_SECRET,

      { expiresIn: 3600 },
      (err, emailToken) => {
        if (err) {
          console.log(err);
          throw err;
        }

        const url = `http://localhost:5000/api/registerUser/${emailToken}`;

        transporter.sendMail({
          to: user.email,
          subject: "Confirm Email",
          html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
        });
        res.json("an email has been sent");
        console.log("email sent");
      }
    );
  } catch (err) {
    console.log(err)
    res.status(500).send("Server error");
  }
});


router.get('/:emailToken', async (req,res)=>{
    
    try{
        const decoded = jwt.verify(req.params.emailToken, process.env.EMAIL_SECRET)
        console.log(decoded)

        const confirmedUser = await User.findOneAndUpdate({_id: decoded.user.id}, {confirmed: true }, {new:true})
        res.send(confirmedUser)
    }catch (e) {
        console.log(e)
        res.send('error');
      }


})

module.exports = router;


// login - is email is not validated -> please ask to validate email

// passoerd reset