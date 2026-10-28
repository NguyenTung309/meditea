import request from "./request";

const apiUser = "/api/user";
export const requestLogin = async (data) => {
  const res = await request.post(`${apiUser}/login`, data);
  return res.data;
};

export const requestRegister = async (data) => {
  const res = await request.post(`${apiUser}/register`, data);
  return res.data;
};
export const requestLogout = async () => {
  const res = await request.get(`${apiUser}/logout`);
  return res.data;
};
export const requestAuth = async () => {
  const res = await request.get(`${apiUser}/auth`);
  return res.data;
};
export const requestForgotPassword = async (data) => {
  // data: { email }
  const res = await request.post(`${apiUser}/forgot-password`, data);
  return res.data;
};

// 2) Xác thực token + đặt mật khẩu mới
export const requestVerifyForgotPassword = async (data) => {
  // data: { token, password } (hoặc newPassword tuỳ backend)
  const res = await request.post(`${apiUser}/verify-forgot-password`, data);
  return res.data;
};
export const requestVerifyOtp = async (data) => {
  // data: { otp }
  const res = await request.post(`${apiUser}/verify-otp`, data);
  return res.data;
};
export const requestLoginGoogle = async (data) => {
  const res = await request.post(`${apiUser}/login-google`, data);
  return res.data;
};
export const getUserById = async (userId) => {
  const res = await request.get(`${apiUser}/get-user/${userId}`);
  return res.data;
};

export const updateUser = async (userId, data) => {
  const res = await request.put(`${apiUser}/update-user/${userId}`, data);
  return res.data;
};

export const createUser = async (data) => {
  const res = await request.post(`${apiUser}/create-user`, data);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await request.delete(`${apiUser}/delete/${userId}`);
  return res.data;
};

export const getAllUsers = async (params) => {
  const res = await request.get(`${apiUser}/get-all-user`, { params });
  return res.data;
};
