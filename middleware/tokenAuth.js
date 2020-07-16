const createError = require('http-errors');
const User = require('../models/User');

const authorizeToken = async (req, res, next) => {
  // Get token from request
  const token = req.header('X-Auth-Token');
  try {
    // See if there is a user with the ID inside the token
    const user = await User.findByToken(token);
    // If not, throw Error
    if (!user) throw new createError.Unauthorized();
    // Else attach user to request for further authentication, then next();
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorizeToken;
