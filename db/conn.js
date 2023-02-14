const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to the MongoDB database using Mongoose library
    await mongoose.connect(process.env.DB_URI, {
      // Use the new URL parser for MongoDB
      useNewUrlParser: true,
      // Use the new unified topology engine for MongoDB
      useUnifiedTopology: true,
    });
    // Log success message to the console if the connection is successful
    console.log("Database connected successfully");
  } catch (error) {
    // Log error message and details to the console if the connection fails
    console.log("Database connection failed", error);
  }
};

// Export the connectDB function
module.exports = connectDB;
