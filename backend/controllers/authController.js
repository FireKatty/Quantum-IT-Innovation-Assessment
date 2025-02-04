const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/authSchema");

const signup = async (req, res) => {
  const { name, email, password, dob } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dob,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(201).json({
      message: "Signup successful",
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, dob: savedUser.dob },
      token,
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );


    // Send response
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, dob: user.dob },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const logout = async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        expires: new Date(0), // Expire immediately
      });
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
};
  

  

module.exports = { signup, login, logout };
