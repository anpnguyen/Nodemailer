require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const path = require('path')


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














const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
