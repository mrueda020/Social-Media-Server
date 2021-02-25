const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { SECRET_KEY } = require("../config");

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid token");
      }
    }
    throw new AuthenticationError("Auth token must be 'Bearer [token]");
  }
  throw new Error("Token must be provided");
};

module.exports = checkAuth;
