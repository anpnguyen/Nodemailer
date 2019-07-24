require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const RegisterUser = require('./routes/api/RegisterUser')
const AuthUser = require('./routes/api/AuthUser')
const nodemailer = require('nodemailer')


app.use(express.json({ extended: false }));
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB connected...");
  } catch (err) {
      console.log(err)
    process.exit(1);
  }
};

connectDB();




const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


app.get('/', (req,res) => res.send('api running'))
app.use("/api/registerUser", RegisterUser);
app.use("/api/authUser", AuthUser);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
