const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

router.get('/', (req, res)=>res.send('you hit the register Page'))


router.post(
    "/",
    
  
    async (req, res) => {
      
      const { username, email, password } = req.body;
  
      try {
        let user = await User.findOne({ email });
  
        if (user) {
          return res
            .status(400)
            .json({
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
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
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
      }
    }
  );


module.exports = router
