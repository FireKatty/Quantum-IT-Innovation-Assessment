const jwt = require ("jsonwebtoken");
const User = require("../model/authSchema");

const protectRoute = async (req, res, next) => {
	try {
        console.log(req.headers)
		const token = req.headers["authorization"];
        console.log(token)

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		next();

	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports =  protectRoute;


