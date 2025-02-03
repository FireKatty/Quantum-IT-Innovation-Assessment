const User = require("../model/authSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async(req,res)=>{
    const {name,email,password,dob} = req.body;
    try {
        console.log(name,email,password,dob);
        const hashpassword = await bcrypt.hash(password,10);
    
        const token = jwt.sign({email},process.env.JWT_KEY,{expiresIn:'1h'});

        const user = new User({
            name,
            email,
            password:hashpassword,
            dob
        });

        console.log(user)

        const result = await user.save();

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: 'None', 
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
        });

        res.status(200).send({message:"signup successful",result,token});

    } catch (error) {
        res.send({message:"Signup failed"});
    }
};



const login = async(req,res)=>{
    const {email,password} = req.body;
    try {

        const user = await User.findOne({email});

        if (!user) return res.status(404).send({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials' });

        const token = jwt.sign({email},process.env.JWT_KEY,{expiresIn:'1h'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: 'None', 
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
        });

        res.status(200).send({message:"login successful",token,user});

    } catch (error) {
        res.status(500).send({message:"login failed"});
    }
};

module.exports = {signup,login};