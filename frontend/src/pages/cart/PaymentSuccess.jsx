import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Leaf,
} from "lucide-react";
import { message, Spin } from "antd";

import "./paymentSuccess.css";
import { requestPaymentById } from "../../config/PaymentRequest";
import ComplaintModal from "../../components/complaint/ComplaintModal";

// Lưu orderId vào localStorage để hiện thị ở trang My Orders
const saveOrderId = (id) => {
  try {
    const ids = JSON.parse(localStorage.getItem("myOrderIds") || "[]");
    if (!ids.includes(id)) {
      ids.unshift(id);
      localStorage.setItem("myOrderIds", JSON.stringify(ids.slice(0, 50)));
    }
  } catch {}
};

function PaymentSuccess() {
  const { orderId } = useParams();
  const [dataPayment, setDataPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataPayment = async () => {
      try {
        const res = await requestPaymentById(orderId);
        setDataPayment(res?.metadata || null);
        if (orderId) saveOrderId(orderId);
      } catch (error) {
        console.log(error);
        message.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchDataPayment();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      vnpay: "VNPay",
      sepay: "Chuyển khoản QR",
    };
    return methods[method] || method;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        text: "Chờ xác nhận",
        className: "status-badge status-pending",
      },
      confirmed: {
        text: "Đã xác nhận",
        className: "status-badge status-confirmed",
      },
      shipping: {
        text: "Đang giao hàng",
        className: "status-badge status-shipping",
      },
      completed: {
        text: "Hoàn thành",
        className: "status-badge status-completed",
      },
      cancelled: {
        text: "Đã hủy",
        className: "status-badge status-cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={config.className}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <Spin size="large" tip="Đang chuẩn bị thông tin đơn trà của bạn..." />
        </div>
      </div>
    );
  }

  if (!dataPayment) {
    return (
      <div className="payment-page">
        <div className="payment-not-found">
          <p>Không tìm thấy đơn hàng</p>
          <Link to="/" className="back-home-link">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const products = dataPayment.products || [];

  return (
    <div className="payment-success-page">
      <div className="paymentDecor paymentDecorLeft" />
      <div className="paymentDecor paymentDecorRight" />

      <div className="payment-container">
        <div className="success-card">
          <div className="paymentEyebrow">MediTea Order</div>

          <div className="success-icon-wrap">
            <CheckCircle className="success-icon" size={80} />
          </div>

          <h1 className="success-title">Đơn trà của bạn đã được ghi nhận</h1>

          <p className="success-text">
            Cảm ơn bạn đã lựa chọn những sản phẩm trà cho hành trình thư giãn và
            chăm sóc bản thân. Chúng tôi sẽ sớm xác nhận và chuẩn bị đơn hàng
            cho bạn.
          </p>

          <div className="order-code">
            <span className="order-code-label">Mã đơn hàng:</span>
            <span className="order-code-value">{dataPayment._id}</span>
          </div>
        </div>

        <div className="payment-grid">
          <div className="payment-left">
            <div className="info-card">
              <h2 className="section-title">
                <User size={24} />
                <span>Thông Tin Người Nhận</span>
              </h2>

              <div className="info-list">
                <div className="info-item">
                  <User className="info-icon" size={18} />
                  <div>
                    <p className="info-label">Họ và tên</p>
                    <p className="info-value">{dataPayment.fullName}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Phone className="info-icon" size={18} />
                  <div>
                    <p className="info-label">Số điện thoại</p>
                    <p className="info-value">{dataPayment.phoneNumber}</p>
                  </div>
                </div>

                <div className="info-item">
                  <Mail className="info-icon" size={18} />
                  <div>
                    <p className="info-label">Email</p>
                    <p className="info-value">{dataPayment.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <MapPin className="info-icon" size={18} />
                  <div>
                    <p className="info-label">Địa chỉ giao hàng</p>
                    <p className="info-value">{dataPayment.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2 className="section-title">
                <Package size={24} />
                <span>Sản Phẩm Đã Đặt</span>
              </h2>

              <div className="product-list">
                {products.map((item) => {
                  const product = item.productId || {};
                  const price = Number(product.priceProduct || 0);
                  const discount = Number(product.discountProduct || 0);
                  const priceAfterDiscount = price - (price * discount) / 100;
                  const subtotal = priceAfterDiscount * Number(item.quantity || 0);

                  return (
                    <div key={item._id} className="product-item">
                      <img
                        src={
                          product.imagesProduct?.[0] ||
                          "https://via.placeholder.com/200x240?text=Tea"
                        }
                        alt={product.nameProduct}
                        className="product-image"
                      />

                      <div className="product-content">
                        <div className="product-badge">
                          <Leaf size={14} />
                          Trà tuyển chọn
                        </div>

                        <h3 className="product-name">{product.nameProduct}</h3>

                        <p className="product-description">
                          {product.descriptionProduct ||
                            "Dòng trà được lựa chọn cho trải nghiệm thanh vị, nhẹ nhàng và thư giãn mỗi ngày."}
                        </p>

                        <div className="product-price-row">
                          {discount > 0 && (
                            <span className="old-price">{formatPrice(price)}</span>
                          )}

                          <span className="new-price">
                            {formatPrice(priceAfterDiscount)}
                          </span>

                          {discount > 0 && (
                            <span className="discount-badge">-{discount}%</span>
                          )}
                        </div>

                        <div className="product-footer">
                          <p className="product-quantity">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="product-subtotal">
                            {formatPrice(subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="payment-right">
            <div className="summary-card">
              <div className="summary-icon-box">
                <CreditCard size={18} />
              </div>

              <h2 className="summary-title">Thông Tin Đơn Hàng</h2>
              <p className="summary-subtitle">
                Theo dõi nhanh trạng thái đơn trà và thông tin thanh toán của
                bạn.
              </p>

              <div className="summary-info-list">
                <div className="summary-info-item">
                  <Calendar className="info-icon" size={18} />
                  <div className="summary-info-content">
                    <p className="info-label">Ngày đặt</p>
                    <p className="info-value">
                      {formatDate(dataPayment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="summary-info-item">
                  <CreditCard className="info-icon" size={18} />
                  <div className="summary-info-content">
                    <p className="info-label">Phương thức thanh toán</p>
                    <p className="info-value">
                      {getPaymentMethodName(dataPayment.paymentMethod)}
                    </p>
                  </div>
                </div>

                <div className="status-wrap">
                  <p className="info-label">Trạng thái</p>
                  {getStatusBadge(dataPayment.status)}
                </div>
              </div>

              <div className="payment-total-section">
                <h3 className="payment-total-title">Chi Tiết Thanh Toán</h3>

                <div className="payment-total-list">
                  <div className="payment-total-row">
                    <span>Tạm tính</span>
                    <span className="strong-text">
                      {formatPrice(dataPayment.totalPrice)}
                    </span>
                  </div>

                  {dataPayment.couponId && (
                    <div className="payment-total-row discount-row">
                      <span>
                        Giảm giá ({dataPayment.couponId.nameCoupon} -{" "}
                        {dataPayment.couponId.discount}%)
                      </span>
                      <span className="strong-text">
                        -
                        {formatPrice(
                          Number(dataPayment.totalPrice || 0) -
                            Number(dataPayment.finalPrice || 0),
                        )}
                      </span>
                    </div>
                  )}

                  <div className="payment-total-row">
                    <span>Phí vận chuyển</span>
                    <span className="strong-text">Miễn phí</span>
                  </div>

                  <div className="payment-total-final">
                    <span>Tổng cộng</span>
                    <span className="final-price">
                      {formatPrice(dataPayment.finalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <Link to="/shop" className="action-link">
                  <button className="btn btn-primary">Tiếp Tục Mua Sắm</button>
                </Link>

                <Link to="/orders" className="action-link">
                  <button className="btn btn-secondary">
                    Xem Đơn Hàng Của Tôi
                  </button>
                </Link>

                <div style={{ marginTop: 8 }}>
                  <ComplaintModal
                    orderId={dataPayment?._id}
                    orderStatus={dataPayment?.status}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;