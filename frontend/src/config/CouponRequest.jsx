import request from "./request";

const apiCoupon = "/api/Coupon";

// GET: list
export const listCoupon = async () => {
  const res = await request.get(`${apiCoupon}/list`);
  return res.data;
};

// POST: create
// data ví dụ: { code, discountType, discountValue, ... }
export const createCoupon = async (data) => {
  const res = await request.post(`${apiCoupon}/create`, data);
  return res.data;
};

// PUT: update/:id
export const updateCoupon = async (id, data) => {
  const res = await request.put(`${apiCoupon}/update/${id}`, data);
  return res.data;
};

// DELETE: delete/:id
export const deleteCoupon = async (id) => {
  const res = await request.delete(`${apiCoupon}/delete/${id}`);
  return res.data;
};
