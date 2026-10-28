const { verifyToken } = require("../auth/checkAuth");
const { AuthFailureError, ForbiddenError } = require("../core/error.response");
const userModel = require("../models/user.model");

const authUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const logged = req.cookies.logged;
    if ((logged && !accessToken) || (!logged && accessToken)) {
      res.clearCookie("logged");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    if (!accessToken) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const decoded = await verifyToken(accessToken);
    if (!decoded) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    req.user = decoded.id;
    next();
  } catch (error) {
    throw new AuthFailureError("Vui lòng đăng nhập lại");
  }
};
const authAdmin = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthFailureError("vui lòng đăng nhập lại");
    }
    const decoded = await verifyToken(accessToken);
    if (!decoded) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const findUser = await userModel.findById(decoded.id);
    if (!findUser) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    if (findUser.isAdmin === false) {
      throw new ForbiddenError("Bạn không có quyền truy cập");
    }
    next();
  } catch (error) {
    throw new ForbiddenError("Bạn không có quyền truy cập");
  }
};
const authSeller = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const decode = await verifyToken(accessToken);
    if (!decode) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const findSeller = await userModel.findById(decode.id);
    if (!findSeller) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    if (findUser.isAdmin === false) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
  } catch (error) {
    throw new ForbiddenError("Bạn không có quyền truy cập");
  }
};
module.exports = { authUser, authAdmin };
