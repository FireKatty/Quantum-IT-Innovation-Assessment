const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  id: { type: Number, required: true, unique: true },

  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phoneNumber: { type: String, required: true },

  salary: { type: String, required: true },

  role: { type: String, enum: ['Admin', 'Manager', 'Employee'], required: true },

  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

  permissions: { type: [String], required: true },

});
const Data = mongoose.model('userData', userSchema);
module.exports = Data;