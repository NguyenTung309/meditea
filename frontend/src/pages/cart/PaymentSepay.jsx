import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { message, Spin } from "antd";
import { requestPaymentById } from "../../config/PaymentRequest";
import "./paymentSuccess.css"; // Tái sử dụng các class style của payment success

function PaymentSepay() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [dataPayment, setDataPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState("");
  const pollingRef = useRef(null);

  // Lấy các cấu hình VietQR từ biến môi trường
  const bankCode = import.meta.env.VITE_SEPAY_BANK_CODE || "MBBank";
  const bankAcc = import.meta.env.VITE_SEPAY_ACC_NUMBER || "0987654321";
  const bankName = import.meta.env.VITE_SEPAY_ACC_NAME || "CONG TY MEDI TEA";

  // Hàm copy vào clipboard
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    message.success(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(""), 2000);
  };

  useEffect(() => {
    const fetchDataPayment = async () => {
      try {
        const res = await requestPaymentById(orderId);
        setDataPayment(res?.metadata || null);

        // Nếu đơn hàng đã thanh toán rồi (trạng thái khác pending), chuyển hướng thẳng sang Success
        if (res?.metadata && res?.metadata?.status !== "pending") {
          navigate(`/payment-success/${orderId}`);
        }
      } catch (error) {
        console.error(error);
        message.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchDataPayment();
  }, [orderId, navigate]);

  // Thiết lập cơ chế Polling để check trạng thái đơn hàng tự động
  useEffect(() => {
    if (dataPayment && dataPayment.status === "pending") {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await requestPaymentById(orderId);
          const currentStatus = res?.metadata?.status;
          
          if (currentStatus && currentStatus !== "pending") {
            clearInterval(pollingRef.current);
            message.success("Thanh toán thành công!");
            navigate(`/payment-success/${orderId}`);
          }
        } catch (error) {
          console.error("Lỗi khi polling đơn hàng:", error);
        }
      }, 3000); // Polling mỗi 3 giây
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [dataPayment, orderId, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-loading">
          <Spin size="large" tip="Đang chuẩn bị thông tin mã VietQR..." />
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

  const amount = dataPayment.finalPrice || dataPayment.totalPrice;
  const description = `SEVQR DH${dataPayment._id}`;
  
  // URL sinh VietQR động qua API SePay
  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAcc}&bank=${bankCode}&amount=${amount}&des=${description}`;

  return (
    <div className="payment-success-page">
      <div className="paymentDecor paymentDecorLeft" />
      <div className="paymentDecor paymentDecorRight" />

      <div className="payment-container" style={{ maxWidth: "900px" }}>
        <div className="success-card" style={{ paddingBottom: "20px" }}>
          <div className="paymentEyebrow">Thanh Toán Đơn Trà</div>
          <h1 className="success-title" style={{ fontSize: "28px" }}>
            Quét mã VietQR để hoàn tất thanh toán
          </h1>
          <p className="success-text">
            Hệ thống sẽ tự động xác nhận sau khi bạn hoàn thành giao dịch chuyển khoản.
          </p>
        </div>

        <div className="payment-grid">
          {/* Cột trái: Mã QR Code */}
          <div className="payment-left" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="info-card" style={{ width: "100%", textAlign: "center", padding: "30px 20px" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "16px",
                  display: "inline-block",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={qrUrl}
                  alt="VietQR Payment Code"
                  style={{ width: "240px", height: "240px", display: "block" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: "#2e7d32", fontWeight: "600", fontSize: "15px" }}>
                <ShieldCheck size={18} />
                <span>Mã VietQR thanh toán an toàn</span>
              </div>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "8px", maxWidth: "320px", marginLeft: "auto", marginRight: "auto" }}>
                Dùng ứng dụng ngân hàng (Mobile Banking) quét mã QR để tự điền Số tài khoản, Số tiền và Nội dung.
              </p>
            </div>
          </div>

          {/* Cột phải: Thông tin chi tiết */}
          <div className="payment-right">
            <div className="summary-card">
              <div className="summary-icon-box">
                <CreditCard size={18} />
              </div>
              <h2 className="summary-title" style={{ marginBottom: "15px" }}>Thông Tin Chuyển Khoản</h2>

              <div className="summary-info-list" style={{ gap: "12px", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "15px" }}>
                
                {/* Ngân hàng */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Ngân hàng nhận:</span>
                  <span style={{ fontWeight: "600", color: "#111" }}>{bankCode}</span>
                </div>

                {/* Số tài khoản */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Số tài khoản:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: "600", color: "#111" }}>{bankAcc}</span>
                    <button
                      onClick={() => handleCopy(bankAcc, "Số tài khoản")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
                    >
                      {copiedField === "Số tài khoản" ? <Check size={16} color="green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Tên tài khoản */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Chủ tài khoản:</span>
                  <span style={{ fontWeight: "600", color: "#111" }}>{bankName}</span>
                </div>

                {/* Số tiền */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#666", fontSize: "14px" }}>Số tiền:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: "700", color: "#d32f2f", fontSize: "16px" }}>{formatPrice(amount)}</span>
                    <button
                      onClick={() => handleCopy(amount.toString(), "Số tiền")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}
                    >
                      {copiedField === "Số tiền" ? <Check size={16} color="green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Nội dung chuyển khoản */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fffde7", padding: "10px", borderRadius: "8px", border: "1px dashed #fbc02d" }}>
                  <span style={{ color: "#555", fontSize: "14px", fontWeight: "600" }}>Nội dung CK:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontWeight: "800", color: "#f57f17", fontSize: "15px" }}>{description}</span>
                    <button
                      onClick={() => handleCopy(description, "Nội dung chuyển khoản")}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#f57f17" }}
                    >
                      {copiedField === "Nội dung chuyển khoản" ? <Check size={16} color="green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Status Polling Indicator */}
              <div style={{ padding: "15px 0", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <Spin size="small" />
                  <span style={{ fontSize: "14px", color: "#555", fontWeight: "500" }}>Đang quét trạng thái giao dịch ngân hàng...</span>
                </div>
                <div style={{ fontSize: "12px", color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <Clock size={12} />
                  <span>Xác nhận tự động trong 10-30 giây</span>
                </div>
              </div>

              {/* Warning Alert */}
              <div
                style={{
                  background: "#fff8e1",
                  border: "1px solid #ffe082",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <AlertCircle size={20} color="#ffb300" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ fontSize: "12px", color: "#6d4c41", margin: 0, textAlign: "left", lineHeight: "1.5" }}>
                  <strong>Lưu ý:</strong> Vui lòng quét mã QR hoặc copy đúng <strong>Số tiền</strong> và <strong>Nội dung chuyển khoản</strong> ở trên để giao dịch được xử lý tự động. Không tự ý thay đổi nội dung chuyển khoản.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link to="/orders" className="action-link" style={{ width: "100%" }}>
                  <button className="btn btn-secondary" style={{ width: "100%" }}>
                    Quản lý Đơn Hàng Của Tôi
                  </button>
                </Link>
                <Link to="/" className="action-link" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", fontSize: "14px", color: "#666", marginTop: "5px" }}>
                  <ArrowLeft size={14} />
                  <span>Quay về trang chủ mua sắm</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSepay;
