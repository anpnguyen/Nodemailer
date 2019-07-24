const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


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

module.exports = router;