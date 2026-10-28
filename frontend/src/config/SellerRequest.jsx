import request from "./request";

const apiStore = "/api/store";
const apiReview = "/api/review";
const apiFeedback = "/api/feedback";
const apiComplaint = "/api/complaint";
const apiPaymentAdmin = "/api/payment/admin";

// ─── STORE ─────────────────────────────────────────────
export const getStore = async () => {
  const res = await request.get(`${apiStore}`);
  return res.data;
};

export const updateStore = async (formData) => {
  const res = await request.put(`${apiStore}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── REVIEW ────────────────────────────────────────────
export const createReview = async (data) => {
  const res = await request.post(`${apiReview}/create`, data);
  return res.data;
};

export const getReviewsByProduct = async (productId) => {
  const res = await request.get(`${apiReview}/product/${productId}`);
  return res.data;
};

export const getAllReviews = async () => {
  const res = await request.get(`${apiReview}/list`);
  return res.data;
};

// ─── FEEDBACK ──────────────────────────────────────────
export const createFeedback = async (data) => {
  const res = await request.post(`${apiFeedback}/create`, data);
  return res.data;
};

export const getMyFeedback = async () => {
  const res = await request.get(`${apiFeedback}/my`);
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await request.get(`${apiFeedback}/list`);
  return res.data;
};

export const replyFeedback = async (id, adminReply) => {
  const res = await request.put(`${apiFeedback}/reply/${id}`, { adminReply });
  return res.data;
};

// ─── COMPLAINT ─────────────────────────────────────────
export const createComplaint = async (data) => {
  const res = await request.post(`${apiComplaint}/create`, data);
  return res.data;
};

export const getAllComplaints = async () => {
  const res = await request.get(`${apiComplaint}/list`);
  return res.data;
};

export const updateComplaintStatus = async (id, data) => {
  const res = await request.put(`${apiComplaint}/update/${id}`, data);
  return res.data;
};

// ─── PAYMENT ADMIN ─────────────────────────────────────
export const getOrdersAdmin = async () => {
  const res = await request.get(`${apiPaymentAdmin}/list`);
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await request.put(`${apiPaymentAdmin}/update/${orderId}`, { status });
  return res.data;
};

export const getSalesReport = async (type = "month") => {
  const res = await request.get(`${apiPaymentAdmin}/report?type=${type}`);
  return res.data;
};

export const getShippingLabel = async (orderId) => {
  const res = await request.get(`${apiPaymentAdmin}/shipping-label/${orderId}`);
  return res.data;
};
