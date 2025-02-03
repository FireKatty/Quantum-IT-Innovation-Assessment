const mongoose = require("mongoose");

const connectToDatabase = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");
    } catch (error) {
        console.log("Database Connection Failed")
    }
}

module.exports = connectToDatabase;