import request from "./request";

const apiCategory = "/api/category";

export const listCategory = async () => {
  const res = await request.get(`${apiCategory}/list`);
  return res.data;
};
export const deleteCategory = async (id) => {
  const res = await request.delete(`${apiCategory}/delete/${id}`);
  return res.data;
};
export const createCategory = async (payload) => {
  const formData = new FormData();

  // append tất cả field text
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "imageCategory" && value instanceof File) {
      formData.append("imageCategory", value);
      return;
    }

    if (!(value instanceof File)) {
      formData.append(key, value);
    }
  });

  const res = await request.post(`${apiCategory}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
export const updateCategory = async (id, payload) => {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "imageCategory" && value instanceof File) {
      formData.append("imageCategory", value);
      return;
    }

    if (!(value instanceof File)) {
      formData.append(key, value);
    }
  });

  const res = await request.put(`${apiCategory}/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
