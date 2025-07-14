const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, password, email, phone, address, role } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      password: hashedPassword,
      email,
      phone,
      address,
      role,
    });
    await user.save();
    res
      .status(201)
      .json({ message: `User registered successfully ${name}` });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//register sample request body
// {
//   "name": "John Doe",
//   "email": "john.doe@example.com",
//   "phone": "1234567890",
//   "address": "123 Main St",
//   "password": "password123",
//   "role": "citizen"
// }

const login = async (req, res) => {
  const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User ${email} not found` });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token , user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
//write a logout route that clears the token from the client side
const logout = async (req, res) => {
  
  res.status(200).json({ message: "Logout successful" });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user );
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllWorkerProfile = async (req, res) => {
  console.log("Fetching all worker profiles...");
  try {
    const workers = await User.find({ role: 'worker' });
    if (!workers || workers.length === 0) {
      return res.status(404).json({ message: "No workers found" });
    }
    res.status(200).json(workers);
    console.log(workers)
  } catch (error) {
    console.error("Get worker profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.department = req.body.department || user.department;

    await user.save();
    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Save user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUserProfile,
  saveUserProfile,
  getAllWorkerProfile,
};
