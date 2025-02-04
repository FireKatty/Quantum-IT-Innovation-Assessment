const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const router = express.Router();

const path = require("path");

// Importing controller functions
const { getData, fetchData,updateData, updateRole, updateStatus, deleteData } = require("../controllers/dataController");

// Define the routes
router.post('/create',protectRoute,getData);
router.get('/list',protectRoute, fetchData);
router.put('/editrole/:id',protectRoute, updateRole);
router.put('/toggleStatus/:id' , protectRoute,updateStatus);
router.put('/update/:id',protectRoute, updateData);
router.delete('/delete/:id' ,protectRoute , deleteData);

module.exports = router;
