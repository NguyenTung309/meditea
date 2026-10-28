import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin, Tag, Empty, message } from "antd";
import {
  ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CarOutlined, SyncOutlined, CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { requestPaymentById } from "../../config/PaymentRequest";
import ComplaintModal from "../../components/complaint/ComplaintModal";
import "./myOrders.css";

const STATUS_ICON = {
  pending: <ClockCircleOutlined style={{ color: "#faad14" }} />,
  confirmed: <CheckCircleOutlined style={{ color: "#1677ff" }} />,
  delivered: <CarOutlined style={{ color: "#722ed1" }} />,
  completed: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
  cancelled: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
};

const STATUS_COLOR = {
  pending: "orange",
  confirmed: "blue",
  delivered: "purple",
  completed: "green",
  cancelled: "red",
};

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  delivered: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

// Lấy tất cả orderId từ localStorage (saved khi thanh toán thành công)
// API hiện tại chỉ có GET /payment/order/:orderId (user chỉ xem được đơn của mình qua ID)
// Để giải quyết không cần backend mới: lưu orderId vào localStorage khi payment success
const getSavedOrderIds = () => {
  try {
    return JSON.parse(localStorage.getItem("myOrderIds") || "[]");
  } catch {
    return [];
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const ids = getSavedOrderIds();
      if (ids.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const results = await Promise.allSettled(ids.map((id) => requestPaymentById(id)));
        const valid = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value?.metadata)
          .filter(Boolean);
        setOrders(valid);
      } catch {
        message.error("Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Spin size="large" tip="Đang tải đơn hàng..." />
    </div>
  );

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-header">
          <ShoppingOutlined className="my-orders-icon" />
          <h1>Đơn hàng của tôi</h1>
        </div>

        {orders.length === 0 ? (
          <div className="my-orders-empty">
            <Empty
              description={
                <span>
                  Bạn chưa có đơn hàng nào.{" "}
                  <Link to="/shop">Mua sắm ngay!</Link>
                </span>
              }
            />
          </div>
        ) : (
          <div className="my-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id">
                    <span className="order-id-label">Mã đơn:</span>
                    <span className="order-id-value">{order._id?.slice(-12).toUpperCase()}</span>
                  </div>
                  <div className="order-status-row">
                    {STATUS_ICON[order.status]}
                    <Tag color={STATUS_COLOR[order.status]} style={{ marginLeft: 6 }}>
                      {STATUS_LABEL[order.status] || order.status}
                    </Tag>
                  </div>
                </div>

                {/* Sản phẩm */}
                <div className="order-products">
                  {(order.products || []).map((item, i) => {
                    const p = item.productId || {};
                    const price = Number(p.priceProduct || 0);
                    const discount = Number(p.discountProduct || 0);
                    const finalPrice = price - (price * discount) / 100;
                    return (
                      <div key={i} className="order-product-item">
                        <img
                          src={p.imagesProduct?.[0] || "https://via.placeholder.com/60"}
                          alt={p.nameProduct}
                          className="order-product-img"
                        />
                        <div className="order-product-info">
                          <div className="order-product-name">{p.nameProduct || "Sản phẩm"}</div>
                          <div className="order-product-price">
                            {finalPrice.toLocaleString("vi-VN")}đ × {item.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="order-card-footer">
                  <div className="order-meta">
                    <span className="order-date">
                      🕐 {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                    <span className="order-total">
                      Tổng:{" "}
                      <strong>
                        {Number(order.finalPrice > 0 ? order.finalPrice : order.totalPrice).toLocaleString("vi-VN")}đ
                      </strong>
                    </span>
                  </div>
                  <div className="order-actions">
                    <Link to={`/payment-success/${order._id}`} className="order-detail-link">
                      Xem chi tiết
                    </Link>
                    {/* Chỉ cho phép khiếu nại khi đơn không phải completed/cancelled */}
                    {!["completed", "cancelled"].includes(order.status) && (
                      <ComplaintModal orderId={order._id} orderStatus={STATUS_LABEL[order.status]} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
