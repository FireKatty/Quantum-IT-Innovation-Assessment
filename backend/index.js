const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser())
dotenv.config();


app.use(cors({
    origin: [
      "https://quantum-it-innovation-assessment.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
  

PORT = process.env.PORT || 5432;

const connectToDatabase = require("./db/connectToDatabase");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes")

app.use('/api/auth',authRoutes);
app.use('/api/data',dataRoutes);

app.get('/',(req,res)=>{
    res.status(200).send({message:"Api test Successful"});
});

app.listen(PORT,()=>{
    try {
        connectToDatabase();
        console.log("Server is running on: ",PORT);
    } catch (error) {
        console.log("")
    }
})
