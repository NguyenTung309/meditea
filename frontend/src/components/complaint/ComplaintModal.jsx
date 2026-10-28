import { useState } from "react";
import { Modal, Form, Input, Button, message, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { createComplaint } from "../../config/SellerRequest";

const { TextArea } = Input;

/**
 * ComplaintModal — nút + modal gửi khiếu nại về đơn hàng
 * Props:
 *   orderId  (string) — ID đơn hàng
 *   orderStatus (string) — trạng thái đơn
 */
const ComplaintModal = ({ orderId, orderStatus }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createComplaint({ orderId, reason: values.reason });
      message.success("Khiếu nại đã được gửi. Chúng tôi sẽ xem xét sớm nhất có thể!");
      form.resetFields();
      setOpen(false);
    } catch (err) {
      if (err?.errorFields) return;
      if (err?.response?.status === 401) {
        message.warning("Vui lòng đăng nhập để gửi khiếu nại");
      } else {
        message.error(err?.response?.data?.message || "Gửi khiếu nại thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        danger
        icon={<ExclamationCircleOutlined />}
        onClick={() => setOpen(true)}
        size="small"
      >
        Khiếu nại đơn hàng
      </Button>

      <Modal
        title={<span><ExclamationCircleOutlined style={{ color: "#ff4d4f" }} /> Gửi khiếu nại</span>}
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Gửi khiếu nại"
        cancelText="Huỷ"
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: "#666" }}>Mã đơn hàng: </span>
          <Tag color="blue">{orderId?.slice(-12)?.toUpperCase()}</Tag>
          {orderStatus && (
            <>
              <span style={{ color: "#666", marginLeft: 8 }}>Trạng thái: </span>
              <Tag>{orderStatus}</Tag>
            </>
          )}
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="Lý do khiếu nại"
            rules={[{ required: true, message: "Vui lòng mô tả vấn đề của bạn" }]}
          >
            <TextArea
              rows={4}
              placeholder="VD: Hàng nhận được bị hỏng, sản phẩm không đúng mô tả, chưa nhận được hàng..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ComplaintModal;
