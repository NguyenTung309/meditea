import React, { useEffect, useState } from "react";
import {
  Table, Button, Tag, Modal, Form, Input, message, Flex, Space,
} from "antd";
import { MessageOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAllFeedback, replyFeedback } from "../../../config/SellerRequest";

const { TextArea } = Input;

const TableFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyingItem, setReplyingItem] = useState(null);
  const [form] = Form.useForm();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getAllFeedback();
      setFeedbacks((res?.metadata || []).map((f) => ({ ...f, key: f._id })));
    } catch {
      message.error("Không tải được danh sách phản hồi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const openReply = (item) => {
    setReplyingItem(item);
    form.setFieldsValue({ adminReply: item.adminReply || "" });
    setReplyOpen(true);
  };

  const handleReply = async () => {
    try {
      const values = await form.validateFields();
      setReplyLoading(true);
      await replyFeedback(replyingItem._id, values.adminReply);
      message.success("Đã gửi phản hồi");
      setReplyOpen(false);
      fetchFeedbacks();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Gửi thất bại");
    } finally {
      setReplyLoading(false);
    }
  };

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.userId?.fullName || "—"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.userId?.email}</div>
        </div>
      ),
    },
    { title: "Tiêu đề", dataIndex: "subject", ellipsis: true },
    { title: "Nội dung", dataIndex: "message", ellipsis: true },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => (
        <Tag color={v === "replied" ? "green" : "orange"}>
          {v === "replied" ? "Đã trả lời" : "Chờ phản hồi"}
        </Tag>
      ),
    },
    {
      title: "Trả lời của Admin",
      dataIndex: "adminReply",
      ellipsis: true,
      render: (v) => v || <span style={{ color: "#aaa" }}>Chưa có</span>,
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Button icon={<MessageOutlined />} onClick={() => openReply(r)} size="small" type="primary">
          {r.status === "replied" ? "Sửa phản hồi" : "Trả lời"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý phản hồi</h2>
        <Button onClick={fetchFeedbacks} loading={loading}>Tải lại</Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={feedbacks}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Trả lời phản hồi"
        open={replyOpen}
        onCancel={() => setReplyOpen(false)}
        onOk={handleReply}
        confirmLoading={replyLoading}
        okText="Gửi phản hồi"
        cancelText="Huỷ"
      >
        <p><strong>Tiêu đề:</strong> {replyingItem?.subject}</p>
        <p><strong>Nội dung:</strong> {replyingItem?.message}</p>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item
            name="adminReply"
            label="Nội dung trả lời"
            rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời" }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung trả lời..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableFeedback;
