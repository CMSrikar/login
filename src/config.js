const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/dbconnect");

//db connection sucess or not 
connect.then(() => {
    console.log("Connected to the database successfully");
}).catch((err) => {
    console.error("Database connection failed:", err);
});

//Craeating a schema for user
const loginschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    }
});

//Creating a model for user
const collection = mongoose.model('users', loginschema);

//Exporting the model
module.exports = collection;