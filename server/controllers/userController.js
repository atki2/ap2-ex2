const { verifyToken } = require('./tokenController');

const User = require('../models/userModel');

// Controller function to handle user creation
async function createUser(req, res) {
  try {
    console.log("create user")
    const { username, password, displayName, profilePic } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(409).json({ error: 'user already exists' });
    }
    const newUser = await User.create({ username, password, displayName, profilePic });
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

// Controller function to get a single user by username
async function getUserByUsername(req, res) {
  try {
    console.log("get user")
    const { username } = req.params;
    if (req.headers.authorization) {
      // Extract the token from that header
      const userOfTheToken = verifyToken(req)
      if (userOfTheToken === null) {
        return res.status(401).send('unauthorized')
      }
      if (!(userOfTheToken.username === username))
        return res.status(401).send('unauthorized')
    }
    else
      return res.status(401).send('Token required');
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const jsonUser = { username: user.username, displayName: user.displayName, profilePic: user.profilePic }
    console.log(jsonUser)
    return res.status(200).json(jsonUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

// Export the controller functions
module.exports = {
  createUser,
  getUserByUsername
};
