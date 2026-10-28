import React, { useEffect, useState } from "react";
import {
  Form, Input, Button, message, Card, Avatar, Upload, Divider, Spin,
} from "antd";
import { ShopOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { getStore, updateStore } from "../../../config/SellerRequest";

const { TextArea } = Input;

const StoreProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bannerFile, setBannerFile] = useState([]);
  const [currentBanner, setCurrentBanner] = useState("");

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await getStore();
      const store = res?.metadata || {};
      form.setFieldsValue({
        storeName: store.storeName,
        description: store.description,
        phone: store.phone,
        address: store.address,
      });
      setCurrentBanner(store.banner || "");
    } catch {
      message.error("Không tải được thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const formData = new FormData();
      formData.append("storeName", values.storeName || "");
      formData.append("description", values.description || "");
      formData.append("phone", values.phone || "");
      formData.append("address", values.address || "");

      if (bannerFile[0]?.originFileObj) {
        formData.append("banner", bannerFile[0].originFileObj);
      }

      await updateStore(formData);
      message.success("Cập nhật cửa hàng thành công!");
      setBannerFile([]);
      fetchStore();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin fullscreen />;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Card
        title={
          <span>
            <ShopOutlined style={{ marginRight: 8, color: "#1677ff" }} />
            Hồ sơ cửa hàng
          </span>
        }
        bordered={false}
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        {/* Banner preview */}
        {currentBanner && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <img
              src={currentBanner}
              alt="banner"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid #f0f0f0",
              }}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>Banner hiện tại</div>
          </div>
        )}

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Tên cửa hàng"
            name="storeName"
            rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng" }]}
          >
            <Input prefix={<ShopOutlined />} placeholder="Tên cửa hàng..." />
          </Form.Item>

          <Form.Item label="Mô tả cửa hàng" name="description">
            <TextArea rows={3} placeholder="Mô tả ngắn về cửa hàng..." />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="VD: 0901234567" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="VD: 123 Lý Thường Kiệt, Q.10, TP.HCM" />
          </Form.Item>

          <Divider />

          <Form.Item label="Upload Banner mới (tùy chọn)">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={bannerFile}
              beforeUpload={() => false}
              onChange={({ fileList }) => setBannerFile(fileList)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh banner</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            size="large"
            style={{ width: "100%" }}
          >
            Lưu thông tin cửa hàng
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default StoreProfile;
