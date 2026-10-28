import React, { useEffect, useState, useMemo } from "react";
import {
  Table, Button, Tag, Space, Modal, message, Flex, Descriptions,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getOrdersAdmin, updateOrderStatus, getShippingLabel } from "../../../config/SellerRequest";

const STATUS_COLOR = {
  pending: "orange",
  confirmed: "blue",
  delivered: "cyan",
  completed: "green",
  cancelled: "red",
};

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  delivered: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

const TableOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  // Shipping label modal
  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingData, setShippingData] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersAdmin();
      const raw = res?.metadata || [];
      setOrders(raw.map((o) => ({ ...o, key: o._id })));
    } catch {
      message.error("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter(o => o.status === filterStatus);
  }, [orders, filterStatus]);

  const handlePrintShipping = async (orderId) => {
    setShippingLoading(true);
    setShippingOpen(true);
    try {
      const res = await getShippingLabel(orderId);
      setShippingData(res?.metadata || null);
    } catch {
      message.error("Không tải được phiếu vận chuyển");
      setShippingOpen(false);
    } finally {
      setShippingLoading(false);
    }
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.fullName}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.phoneNumber}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "Sản phẩm",
      key: "products",
      render: (_, r) => (
        <div>
          {(r.products || []).map((p, i) => (
            <div key={i} style={{ fontSize: 12 }}>
              {p.productId?.nameProduct || "Sản phẩm"} × {p.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "price",
      render: (_, r) => (
        <div style={{ fontWeight: 600, color: "#52c41a" }}>
          {Number(r.finalPrice > 0 ? r.finalPrice : r.totalPrice).toLocaleString("vi-VN")}đ
        </div>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      render: (v) => <Tag>{v?.toUpperCase()}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (v) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v] || v}</Tag>,
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
        <Space direction="vertical" size="small">
          <Button
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintShipping(r._id)}
          >
            Phiếu ship
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
        <Flex align="center" gap={12}>
          <h2 style={{ margin: 0 }}>Quản lý đơn hàng</h2>
          <Tag color="blue">Tổng: {filteredOrders.length} đơn</Tag>
        </Flex>
        <Flex align="center" gap={8}>
          <div style={{ position: "relative" }}>
            <Button onClick={() => setFilterOpen(!filterOpen)}>
              Filter ▼
            </Button>
            {filterOpen && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 4,
                background: "#fff", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 100, minWidth: 180, padding: "4px 0"
              }}>
                {[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Chờ xác nhận" },
                  { value: "confirmed", label: "Đã xác nhận" },
                  { value: "delivered", label: "Đang giao" },
                  { value: "completed", label: "Hoàn thành" },
                  { value: "cancelled", label: "Đã huỷ" },
                ].map(item => (
                  <button key={item.value} onClick={() => { setFilterStatus(item.value); setFilterOpen(false); }} style={{
                    display: "block", width: "100%", padding: "8px 16px", border: "none",
                    background: filterStatus === item.value ? "#e6f4ff" : "transparent",
                    cursor: "pointer", fontSize: 14, textAlign: "left",
                    color: filterStatus === item.value ? "#1677ff" : "#333",
                    fontWeight: filterStatus === item.value ? 600 : 400
                  }}
                  onMouseEnter={e => e.target.style.background = filterStatus === item.value ? "#e6f4ff" : "#f5f5f5"}
                  onMouseLeave={e => e.target.style.background = filterStatus === item.value ? "#e6f4ff" : "transparent"}
                  >{item.label}</button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={fetchOrders} loading={loading}>Tải lại</Button>
        </Flex>
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* SHIPPING LABEL MODAL */}
      <Modal
        title={<span><PrinterOutlined /> Phiếu vận chuyển (giả lập)</span>}
        open={shippingOpen}
        onCancel={() => { setShippingOpen(false); setShippingData(null); }}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In phiếu
          </Button>,
          <Button key="close" onClick={() => { setShippingOpen(false); setShippingData(null); }}>
            Đóng
          </Button>,
        ]}
        width={600}
        loading={shippingLoading}
      >
        {shippingData && (
          <div style={{ fontFamily: "monospace", border: "1px dashed #ccc", padding: 16, borderRadius: 8 }}>
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              📦 PHIẾU VẬN CHUYỂN
            </div>
            <div style={{ textAlign: "center", marginBottom: 16, color: "#1677ff", fontSize: 14 }}>
              Mã theo dõi: <strong>{shippingData.trackingCode}</strong>
            </div>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Người gửi">{shippingData.sender?.name}</Descriptions.Item>
              <Descriptions.Item label="SĐT gửi">{shippingData.sender?.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ gửi">{shippingData.sender?.address}</Descriptions.Item>
              <Descriptions.Item label="Người nhận" style={{ fontWeight: 700 }}>{shippingData.receiver?.name}</Descriptions.Item>
              <Descriptions.Item label="SĐT nhận">{shippingData.receiver?.phone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ nhận">{shippingData.receiver?.address}</Descriptions.Item>
              <Descriptions.Item label="Ngày giao">
                {dayjs(shippingData.shippingDate).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Dự kiến nhận">
                {dayjs(shippingData.estimatedDelivery).format("DD/MM/YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TableOrder;
