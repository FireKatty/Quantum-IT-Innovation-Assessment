const express = require("express");
const Employee = require("../model/userList");

// Store Data
const getData = async (req, res) => {
  try {
    // console.log(req.body)
    const data = req.body.newUser;
    
    const permissions = req.body.permissions;

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check Duplicate Email
    const existingUser = await Employee.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate Mobile Number Format
    const mobileRegex = /^\d{10}$/; // Assuming a 10-digit mobile number
    if (!mobileRegex.test(data.phoneNumber)) {
      return res.status(400).json({ error: "Invalid mobile number, must be 10 digits" });
    }

    // Generate New ID
    const lastEmployee = await Employee.findOne().sort({ id: -1 });
    let newid = 1; // Default ID for the first user

    if (lastEmployee && lastEmployee.id) {
      newid = lastEmployee.id + 1; // Increment based on the last id
    }

    // Create New Employee
    const newEmployee = new Employee({
      id: newid,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      salary: data.salary,
      role: data.role,
      status: data.status,
      permissions: permissions,
    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch Data
const fetchData = async(req,res)=>{
    try {
      // console.log("api run")
        let result = await Employee.find();
        // console.log(result)
        if (result.length > 0) {
          res.send(result); 
        } else {
          res.send({ result: "Not Found" });
        }
    }catch (error){
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update Data
const updateData = async (req, res) => {
  const { id } = req.params;
  const newUser  = req.body.editingUser;
  const permissions = req.body.permissions;
  console.log(id,newUser,permissions)

  try {
    // Find the user by ID and update their details
    const updatedUser = await Employee.findOneAndUpdate(
      { id: id },  // Use `id` field for querying
      { ...newUser, permissions },  // Update with new data and permissions
      { new: true }  // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    // console.log("updated data")
    // console.log(updatedUser)
    res.json({ message: 'Employee updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Role
const updateRole =  async (req, res) => {
  const userId = req.params.id;
  const { role, permissions } = req.body; // Get the new role and permissions from the request body

  try {
    // Find the user by ID and update the role and permissions
    const updatedUser = await Employee.findOneAndUpdate(
      { id: userId }, // Find the user by ID
      { role, permissions }, // Update the role and permissions
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the updated user as the response
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Update Status
const updateStatus = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await Employee.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the user's status
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    user.status = newStatus;

    // Save the updated user
    const updatedUser = await user.save();

    // Send the updated user as the response
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error toggling user status' });
  }
};


// Delete data
const deleteData = async (req, res) => {
  const { id } = req.params; // Extract the custom `id` from request parameters
  console.log("ID to delete:", id);

  try {
      // Find and delete the employee by the custom `id` field
      const deletedEmployee = await Employee.findOneAndDelete({ id: id });

      if (!deletedEmployee) {
          return res.status(404).json({ error: 'Employee not found' });
      }

      res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {getData,fetchData,updateData,updateRole,updateStatus,deleteData};