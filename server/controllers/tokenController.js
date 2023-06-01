const User = require('../models/userModel');
const jwt = require("jsonwebtoken")
const key = "Some super secret key shhhhhhhhhhhhhhhhh!!!!!"

// Controller function to handle token creation
async function createToken(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username, password: password });
        if (!user) {
            return res.status(404).json({ error: 'username or password invalid' });
        }
        const data = { username: username, password: password }
        // Generate the token.
        const token = jwt.sign(data, key)
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create token' });
    }
}

function verifyToken(req) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const cleanedToken = token.replace(/"/g, "");
        // Verify the token is valid
        const userOfTheToken = jwt.verify(cleanedToken, key)
        return userOfTheToken
    } catch (err) {
        console.log(err)
        return null;
    }
}

// Export the controller functions
module.exports = {
    createToken,
    verifyToken
};
