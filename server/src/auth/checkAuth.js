const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
    algorithm: "HS256",
  });
};
const verifyToken = async (token) => {
  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decode);
  return decode;
};
const client_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(client_id);

const verifyTokenGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: client_id,
  });
  const payload = ticket.getPayload();
  return payload;
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  asyncHandler,
  verifyTokenGoogle,
};
