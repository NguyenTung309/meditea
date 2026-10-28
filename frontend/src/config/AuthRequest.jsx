import request from "./request";
export const adminCheck = async () => {
  const res = await request.get("/api/auth/admin-check");
  return res.data;
};
