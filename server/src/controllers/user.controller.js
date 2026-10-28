const {
  ConflictRequestError,
  NotFoundError,
  AuthFailureError,
  BadRequestError,
} = require("../core/error.response");
const { Created, OK } = require("../core/success.response");

const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");
const jwt = require("jsonwebtoken");

const {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  verifyTokenGoogle,
} = require("../auth/checkAuth");
const SendMailForgotPassword = require("../utils/mailForgotPassword");

const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");

function setCookie(res, accessToken, refreshToken) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    sameSite: isProduction ? "none" : "lax",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: isProduction ? "none" : "lax",
  });
  res.cookie("logged", 1, {
    httpOnly: false,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: isProduction ? "none" : "lax",
  });
}

function normalizePhoneNumber(phoneNumber) {
  return typeof phoneNumber === "string"
    ? phoneNumber.trim().replace(/[^\d+]/g, "")
    : phoneNumber;
}

class UsersController {
  async register(req, res) {
    const { fullName, password, date, dob, isAdmin } = req.body;
    const email = req.body.email?.trim();
    const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);

    if (!fullName || !email || !phoneNumber || !password || !date || !dob) {
      throw new BadRequestError("Thiếu thông tin đăng ký");
    }

    const findUser = await userModel.findOne({ email });
    if (findUser) {
      throw new ConflictRequestError("Email đã tồn tại");
    }
    if (phoneNumber) {
      const findPhoneUser = await userModel.findOne({ phoneNumber });
      if (findPhoneUser) {
        throw new ConflictRequestError("Số điện thoại đã tồn tại");
      }
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      fullName,
      email,
      phoneNumber,
      date,
      dob,
      password: hashedPassword,
      isAdmin,
    });

    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });

    setCookie(res, accessToken, refreshToken);

    return new Created({
      message: "Đăng ký thành công",
      metadata: newUser,
    }).send(res);
  }
  async login(req, res) {
    const { email, login, phoneNumber, password } = req.body;
    const identifier = (login || email || phoneNumber || "").trim();
    const normalizedPhoneNumber = normalizePhoneNumber(identifier);

    if (!identifier || !password) {
      throw new BadRequestError("Vui lòng nhập tài khoản và mật khẩu");
    }

    const findUser = await userModel.findOne({
      $or: [{ email: identifier }, { phoneNumber: normalizedPhoneNumber }],
    });

    if (!findUser) {
      throw new NotFoundError("Tài khoản hoặc mật khẩu không chính xác !");
    }

    const isMathPassword = await bcrypt.compare(password, findUser.password);

    if (!isMathPassword) {
      throw new AuthFailureError("Tài khoản hoặc mật khẩu không chính xác !");
    }

    const accessToken = createAccessToken({ id: findUser._id });
    const refreshToken = createRefreshToken({ id: findUser._id });

    setCookie(res, accessToken, refreshToken);

    return new OK({
      message: "Đăng nhập thành công",
      metadata: {
        accessToken,
        refreshToken,
        user: {
          _id: findUser._id,
          fullName: findUser.fullName,
          email: findUser.email,
          phoneNumber: findUser.phoneNumber,
          date: findUser.date,
          dob: findUser.dob,
          isAdmin: findUser.isAdmin,
        },
      },
    }).send(res);
  }
  async loginGoogle(req, res) {
    const { token } = req.body;
    if (!token) {
      throw new BadRequestError("Token is required");
    }

    const payload = await verifyTokenGoogle(token);
    if (!payload) {
      throw new AuthFailureError("Xác thực Google thất bại!");
    }

    const { email, name } = payload;
    let findUser = await userModel.findOne({ email });

    if (!findUser) {
      const saltRounds = 10;
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

      const today = new Date().toISOString().split("T")[0];
      findUser = await userModel.create({
        fullName: name || "Google User",
        email,
        password: hashedPassword,
        date: today,
        dob: "2000-01-01",
        isAdmin: false,
      });
    }

    const accessToken = createAccessToken({ id: findUser._id });
    const refreshToken = createRefreshToken({ id: findUser._id });

    setCookie(res, accessToken, refreshToken);

    return new OK({
      message: "Đăng nhập Google thành công",
      metadata: {
        accessToken,
        refreshToken,
        user: {
          _id: findUser._id,
          fullName: findUser.fullName,
          email: findUser.email,
          phoneNumber: findUser.phoneNumber,
          date: findUser.date,
          dob: findUser.dob,
          isAdmin: findUser.isAdmin,
        },
      },
    }).send(res);
  }

  async authUser(req, res) {
    const userId = req.user;
    if (!userId) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    return new OK({
      message: "Xác thực thành công",
      metadata: findUser,
    }).send(res);
  }

  async logout(req, res) {
    const userId = req.user;
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      throw new NotFoundError("Người dùng không tồn tại");
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("logged");
    return new OK({
      message: "Đăng xuất thành công",
      metadata: findUser,
    }).send(res);
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      throw new NotFoundError("Email không tồn tại");
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const tokenForgotPassword = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    res.cookie("tokenForgotPassword", tokenForgotPassword, {
      httpOnly: false,
      secure: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    await otpModel.create({
      otp,
      email,
    });

    await SendMailForgotPassword(email, otp);
    console.log("otp", otp);
    return new OK({
      message: "Mã OTP đã được gửi đến email của bạn",
      metadata: true,
    }).send(res);
  }

  async verifyForgotPassword(req, res) {
    const { otp, password } = req.body;
    const tokenForgotPassword = req.cookies.tokenForgotPassword;
    if (!tokenForgotPassword || !otp) {
      throw new BadRequestError("Bạn đang thiếu thông tin");
    }
    const decoded = jwt.verify(tokenForgotPassword, process.env.JWT_SECRET);
    if (!decoded) {
      throw new BadRequestError("Vui lòng gửi lại yêu cầu ");
    }

    const email = decoded.email;

    const findOtp = await otpModel.findOne({ email, otp });
    if (!findOtp) {
      throw new BadRequestError("Mã OTP không hợp lệ");
    }

    const findUser = await userModel.findOne({ email });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    findUser.password = hashedPassword;

    await findUser.save();

    await otpModel.deleteMany({ email });
    res.clearCookie("tokenForgotPassword");

    return new OK({
      message: "Khôi phục mật khẩu thành công",
      metadata: true,
    }).send(res);
  }
  async verifyOTP(req, res) {
    const { otp } = req.body;
    const tokenForgotPassword = req.cookies.tokenForgotPassword;

    if (!tokenForgotPassword || !otp) {
      throw new BadRequestError("Bạn đang thiếu thông tin");
    }

    // giải mã token để lấy email
    const decoded = jwt.verify(tokenForgotPassword, process.env.JWT_SECRET);
    if (!decoded) {
      throw new BadRequestError("Token không hợp lệ");
    }

    const email = decoded.email;

    // kiểm tra OTP trong database
    const findOtp = await otpModel.findOne({ email, otp });

    if (!findOtp) {
      throw new BadRequestError("Mã OTP không hợp lệ");
    }

    return new OK({
      message: "Xác thực OTP thành công",
      metadata: true,
    }).send(res);
  }
  async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const decoded = await verifyToken(refreshToken);
    if (!decoded) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }
    const accessToken = createAccessToken({ id: decoded.id });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return new OK({
      message: "Refresh token thành công",
      metadata: true,
    }).send(res);
  }
  async getUserById(req, res) {
    const { userId } = req.params;

    if (!userId) {
      throw new BadRequestError("Thiếu userId");
    }

    const findUser = await userModel.findById(userId).select("-password");
    if (!findUser) {
      throw new NotFoundError("Không tìm thấy người dùng");
    }

    return new OK({
      message: "Lấy người dùng thành công",
      metadata: findUser,
    }).send(res);
  }

  async getAllUser(req, res) {
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    return new OK({
      message: "Lấy danh sách người dùng thành công",
      metadata: users,
    }).send(res);
  }

  async createUser(req, res) {
    const { fullName, password, date, dob, isAdmin } = req.body;
    const email = req.body.email?.trim();
    const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);

    if (!fullName || !email || !phoneNumber || !password || !date || !dob) {
      throw new BadRequestError("Thiếu thông tin user");
    }

    const findUser = await userModel.findOne({ email });
    if (findUser) {
      throw new ConflictRequestError("Email đã tồn tại");
    }
    if (phoneNumber) {
      const findPhoneUser = await userModel.findOne({ phoneNumber });
      if (findPhoneUser) {
        throw new ConflictRequestError("Số điện thoại đã tồn tại");
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      date,
      dob,
      isAdmin: !!isAdmin,
    });

    return new Created({
      message: "Tạo user thành công",
      metadata: newUser,
    }).send(res);
  }

  async updateUser(req, res) {
    const { userId } = req.params;
    const { fullName, password, date, dob, isAdmin } = req.body;
    const email = req.body.email?.trim();
    const phoneNumber =
      req.body.phoneNumber === undefined
        ? undefined
        : normalizePhoneNumber(req.body.phoneNumber);

    if (!userId) {
      throw new BadRequestError("Thiếu userId");
    }

    const findUser = await userModel.findById(userId);
    if (!findUser) {
      throw new NotFoundError("Không tìm thấy người dùng");
    }

    if (email && email !== findUser.email) {
      const existedEmail = await userModel.findOne({ email });
      if (existedEmail) {
        throw new ConflictRequestError("Email đã tồn tại");
      }
      findUser.email = email;
    }

    if (phoneNumber !== undefined && phoneNumber !== findUser.phoneNumber) {
      if (phoneNumber) {
        const existedPhone = await userModel.findOne({
          phoneNumber,
          _id: { $ne: userId },
        });
        if (existedPhone) {
          throw new ConflictRequestError("Số điện thoại đã tồn tại");
        }
      }
      findUser.phoneNumber = phoneNumber;
    }

    if (fullName !== undefined) findUser.fullName = fullName;
    if (date !== undefined) findUser.date = date;
    if (dob !== undefined) findUser.dob = dob;
    if (typeof isAdmin === "boolean") findUser.isAdmin = isAdmin;

    if (password) {
      const saltRounds = 10;
      findUser.password = await bcrypt.hash(password, saltRounds);
    }

    await findUser.save();

    return new OK({
      message: "Cập nhật user thành công",
      metadata: await userModel.findById(userId).select("-password"),
    }).send(res);
  }

  async deleteUser(req, res) {
    const { userId } = req.params;

    if (!userId) {
      throw new BadRequestError("Thiếu userId");
    }

    const findUser = await userModel.findById(userId);
    if (!findUser) {
      throw new NotFoundError("Không tìm thấy người dùng");
    }

    await findUser.deleteOne();

    return new OK({
      message: "Xóa user thành công",
      metadata: true,
    }).send(res);
  }
}

module.exports = new UsersController();
