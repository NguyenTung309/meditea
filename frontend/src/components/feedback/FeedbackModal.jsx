import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { createFeedback } from "../../config/SellerRequest";

const { TextArea } = Input;

/**
 * FeedbackModal — nút + modal gửi phản hồi đến admin
 * Dùng ở Header, Footer, hoặc bất kỳ đâu
 */
const FeedbackModal = ({ buttonStyle = {} }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createFeedback(values);
      message.success("Phản hồi của bạn đã được gửi. Cảm ơn bạn!");
      form.resetFields();
      setOpen(false);
    } catch (err) {
      if (err?.errorFields) return;
      if (err?.response?.status === 401) {
        message.warning("Vui lòng đăng nhập để gửi phản hồi");
      } else {
        message.error(err?.response?.data?.message || "Gửi thất bại, thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        icon={<MessageOutlined />}
        onClick={() => setOpen(true)}
        style={buttonStyle}
      >
        Gửi phản hồi
      </Button>

      <Modal
        title={<span><MessageOutlined /> Gửi phản hồi cho MediTea</span>}
        open={open}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Gửi"
        cancelText="Huỷ"
        destroyOnClose
      >
        <p style={{ color: "#666", marginBottom: 16 }}>
          Góp ý của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn mỗi ngày 🍵
        </p>
        <Form form={form} layout="vertical">
          <Form.Item
            name="subject"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Thắc mắc về sản phẩm, Góp ý về dịch vụ..." />
          </Form.Item>
          <Form.Item
            name="message"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea rows={4} placeholder="Chia sẻ ý kiến của bạn..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FeedbackModal;
