import request from "./request";

const apiPayment = "/api/payment";

export const requestPayment = async (data) => {
  const res = await request.post(`${apiPayment}/create`, data);
  return res.data;
};

export const requestPaymentById = async (orderId) => {
  const res = await request.get(`${apiPayment}/order/${orderId}`);
  return res.data;
};
