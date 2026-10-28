import request from "./request";

const apiContent = "/api/content";

export const getAllContent = async () => {
  const res = await request.get(apiContent);
  return res.data;
};

export const getContentByKey = async (key) => {
  const res = await request.get(`${apiContent}/${key}`);
  return res.data;
};

export const updateContent = async (key, data) => {
  const res = await request.put(`${apiContent}/${key}`, data);
  return res.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await request.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
