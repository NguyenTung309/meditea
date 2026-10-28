import React, { useEffect, useState } from "react";
import {
  Table, Button, Tag, Modal, Form, Input, Select, message, Flex,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAllComplaints, updateComplaintStatus } from "../../../config/SellerRequest";

const { TextArea } = Input;
const { Option } = Select;

const STATUS_COLOR = {
  pending: "orange",
  processing: "blue",
  resolved: "green",
  rejected: "red",
};

const STATUS_LABEL = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  resolved: "Đã giải quyết",
  rejected: "Từ chối",
};

const TableComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints();
      setComplaints((res?.metadata || []).map((c) => ({ ...c, key: c._id })));
    } catch {
      message.error("Không tải được danh sách khiếu nại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const openEdit = (item) => {
    setEditing(item);
    form.setFieldsValue({
      status: item.status,
      adminNote: item.adminNote || "",
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);
      await updateComplaintStatus(editing._id, values);
      message.success("Cập nhật khiếu nại thành công");
      setEditOpen(false);
      fetchComplaints();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setEditLoading(false);
    }
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "user",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.userId?.fullName || "—"}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.userId?.email}</div>
        </div>
      ),
    },
    {
      title: "Đơn hàng",
      key: "order",
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 500 }}>ID: {r.orderId?._id?.slice(-8) || "—"}</div>
          <div style={{ color: "#888" }}>
            {(r.orderId?.products || []).map((p, i) => (
              <span key={i}>{p.productId?.nameProduct}</span>
            )).slice(0, 2)}
          </div>
        </div>
      ),
    },
    {
      title: "Lý do khiếu nại",
      dataIndex: "reason",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v] || v}</Tag>,
    },
    {
      title: "Ghi chú admin",
      dataIndex: "adminNote",
      ellipsis: true,
      render: (v) => v || <span style={{ color: "#aaa" }}>Chưa có</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Button
          icon={<ExclamationCircleOutlined />}
          onClick={() => openEdit(r)}
          size="small"
          type="primary"
          disabled={r.status === "resolved" || r.status === "rejected"}
        >
          Xử lý
        </Button>
      ),
    },
  ];

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý khiếu nại</h2>
        <Button onClick={fetchComplaints} loading={loading}>Tải lại</Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={complaints}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Xử lý khiếu nại"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleUpdate}
        confirmLoading={editLoading}
        okText="Cập nhật"
        cancelText="Huỷ"
      >
        <p><strong>Lý do:</strong> {editing?.reason}</p>
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <Option key={k} value={k}>
                  <Tag color={STATUS_COLOR[k]}>{v}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="adminNote" label="Ghi chú (tuỳ chọn)">
            <TextArea rows={3} placeholder="Nhập ghi chú cho khách hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableComplaint;
