const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGO_URL;
const userRoutes = require('./src/Routes/userRoutes')
const thoughtRoutes = require('./src/Routes/thoughRoutes')
//For parsing request body into json formate
app.use(express.json());
// Connect to MongoDB
mongoose
  .connect(MONGODB_URL, {
    dbName: "SocialApp",
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
//User Routes
app.use('/api/users',userRoutes)

//Thought Routes
app.use('/api/thoughts',thoughtRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
