import request from "./request";

const apiCart = "/api/cart";

export const requestAddToCart = async (data) => {
  const res = await request.post(`${apiCart}/create`, data);
  return res.data;
};

export const requestGetCart = async () => {
  const res = await request.get(`${apiCart}/get`);
  return res.data;
};

export const requestUpdateQuantity = async (data) => {
  const res = await request.put(`${apiCart}/update`, data);
  return res.data;
};

export const requestDeleteProductCart = async (productId) => {
  const res = await request.delete(`${apiCart}/delete/${productId}`);
  return res.data;
};

export const requestApplyCounpon = async (data) => {
  const res = await request.put(`${apiCart}/apply-coupon`, data);
  return res.data;
};

export const requestUpdateInfoCart = async (data) => {
  const res = await request.put(`${apiCart}/update-info`, data);
  return res.data;
};
