import React, { useEffect, useState } from "react";
import {
  Table, Button, Tag, Modal, Select, message, Image, Flex, Upload,
} from "antd";
import { UploadOutlined, DeleteOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import { listGalleryImages, uploadGalleryImage, deleteGalleryImage } from "../../../config/GalleryRequest";

const { Dragger } = Upload;

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await listGalleryImages();
      setImages(res?.metadata || []);
    } catch { message.error("Không tải được danh sách ảnh"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async () => {
    if (fileList.length === 0) return message.warning("Chọn file ảnh");
    if (!newCategory) return message.warning("Chọn danh mục");

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", fileList[0].originFileObj || fileList[0]);
      formData.append("category", newCategory);
      await uploadGalleryImage(formData);
      message.success("Thêm ảnh thành công");
      setUploadOpen(false);
      setFileList([]);
      setNewCategory("");
      setPreviewUrl("");
      fetchImages();
    } catch (err) { message.error(err?.response?.data?.message || "Upload thất bại"); }
    finally { setUploadLoading(false); }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xóa ảnh?",
      content: "Bạn có chắc muốn xóa ảnh này?",
      okText: "Xóa", okType: "danger", cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteGalleryImage(id);
          message.success("Đã xóa");
          fetchImages();
        } catch { message.error("Xóa thất bại"); }
      },
    });
  };

  const columns = [
    {
      title: "Ảnh",
      key: "image",
      width: 120,
      render: (_, r) => (
        <Image src={r.imageUrl} alt="" width={100} height={70} style={{ objectFit: "cover", borderRadius: 4 }} />
      ),
    },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt",
      render: (v) => v ? new Date(v).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động", key: "action",
      render: (_, r) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(r._id)}>Xóa</Button>
      ),
    },
  ];

  const CATEGORY_OPTIONS = [
    { value: "Sản phẩm", label: "Sản phẩm" },
    { value: "Vùng trà", label: "Vùng trà" },
    { value: "Xưởng trà", label: "Xưởng trà" },
    { value: "Quy trình", label: "Quy trình" },
    { value: "Khoảnh khắc", label: "Khoảnh khắc" },
  ];

  const uploadProps = {
    onRemove: () => { setFileList([]); setPreviewUrl(""); },
    beforeUpload: (file) => {
      setFileList([file]);
      setPreviewUrl(URL.createObjectURL(file));
      return false;
    },
    fileList,
    accept: "image/*",
    maxCount: 1,
  };

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý thư viện ảnh</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setUploadOpen(true)}>
          Thêm ảnh
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={images.map(i => ({ ...i, key: i._id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Thêm ảnh mới"
        open={uploadOpen}
        onCancel={() => { setUploadOpen(false); setFileList([]); setNewCategory(""); setPreviewUrl(""); }}
        onOk={handleUpload}
        confirmLoading={uploadLoading}
        okText="Upload"
        cancelText="Hủy"
        width={500}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label>Chọn ảnh từ máy:</label>
            <Dragger {...uploadProps} style={{ marginTop: 8 }}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
              <p className="ant-upload-hint">Hỗ trợ JPG, PNG, WEBP (tối đa 10MB)</p>
            </Dragger>
          </div>
          {previewUrl && (
            <Image src={previewUrl} alt="preview" width="100%" style={{ maxHeight: 200, objectFit: "contain", borderRadius: 4 }} />
          )}
          <div>
            <label>Danh mục:</label>
            <Select style={{ width: "100%" }} value={newCategory} onChange={setNewCategory} placeholder="Chọn danh mục">
              {CATEGORY_OPTIONS.map(o => (
                <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageGallery;
