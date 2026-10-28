import request from "./request";

const apiGallery = "/api/gallery";

export const listGalleryImages = async () => {
  const res = await request.get(`${apiGallery}/list`);
  return res.data;
};

export const uploadGalleryImage = async (formData) => {
  const res = await request.post(`${apiGallery}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGalleryImage = async (id) => {
  const res = await request.delete(`${apiGallery}/${id}`);
  return res.data;
};
