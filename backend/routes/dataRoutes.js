const express = require("express");
const protectRoute = require("../middleware/protectMiddleware");
const router = express.Router();

const path = require("path");

// Importing controller functions
const { getData, fetchData,updateData, updateRole, updateStatus, deleteData } = require("../controllers/dataController");

// Define the routes
router.post('/create',getData);
router.get('/list', fetchData);
router.put('/editrole/:id', updateRole);
router.put('/toggleStatus/:id' , updateStatus);
router.put('/update/:id', updateData);
router.delete('/delete/:id' , deleteData);

module.exports = router;
