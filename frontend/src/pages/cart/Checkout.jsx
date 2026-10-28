import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CreditCard,
  Leaf,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { message } from "antd";

import {
  requestGetCart,
  requestUpdateInfoCart,
} from "../../config/CartRequest";
import { requestPayment } from "../../config/PaymentRequest";
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const res = await requestGetCart();
        setCart(res?.metadata?.cart || null);
      } catch (error) {
        message.error(
          error?.response?.data?.message || "Không lấy được giỏ hàng",
        );
        setCart(null);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (
      !shippingInfo.fullName ||
      !shippingInfo.phoneNumber ||
      !shippingInfo.address ||
      !shippingInfo.email
    ) {
      message.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    if (!cart || !cart.products || cart.products.length === 0) {
      message.error("Giỏ hàng trống");
      return;
    }

    try {
      const data = {
        fullName: shippingInfo.fullName,
        phoneNumber: shippingInfo.phoneNumber,
        address: shippingInfo.address,
        email: shippingInfo.email,
        note: shippingInfo.note,
      };

      await requestUpdateInfoCart(data);

      const res = await requestPayment({ typePayment: paymentMethod });

      if (paymentMethod === "cod") {
        message.success("Đặt hàng thành công!");
        navigate(`/payment-success/${res?.metadata?._id}`);
      } else if (paymentMethod === "sepay") {
        navigate(`/payment-sepay/${res?.metadata?._id}`);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi đặt hàng",
      );
    }
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng",
      icon: <Package size={22} />,
      description: "Thanh toán bằng tiền mặt khi đơn hàng được giao tới bạn",
    },
    {
      id: "sepay",
      name: "Chuyển khoản VietQR (Tự động)",
      icon: <CreditCard size={22} />,
      description:
        "Tạo mã VietQR chuyển khoản nhanh và xác nhận tự động tức thì",
    },
  ];

  if (loadingCart) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-loading">
            <h2>Đang chuẩn bị giỏ hàng của bạn...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-loading">
            <h2>Không có sản phẩm để thanh toán</h2>
          </div>
        </div>
      </div>
    );
  }

  const products = cart.products || [];

  return (
    <div className="checkout-page">
      <div className="checkout-decor decor-1" />
      <div className="checkout-decor decor-2" />

      <div className="checkout-container">
        <div className="checkout-header">
          <div className="checkout-eyebrow">MediTea Checkout</div>
          <h1 className="checkout-title">Hoàn tất đơn trà của bạn</h1>
          <p className="checkout-subtitle">
            Điền thông tin giao hàng và lựa chọn phương thức thanh toán để hoàn
            tất trải nghiệm mua sắm nhẹ nhàng, tinh gọn và an tâm.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-layout">
            <div className="checkout-left">
              <div className="checkout-card">
                <div className="checkout-section-head">
                  <div className="checkout-section-icon">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <h2 className="checkout-card-title">Thông tin giao hàng</h2>
                    <p className="checkout-card-subtitle">
                      Vui lòng điền chính xác để đơn trà được giao nhanh và
                      thuận tiện hơn.
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-input-wrap">
                    <label className="checkout-label">
                      <User size={16} />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên người nhận"
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-input-wrap">
                    <label className="checkout-label">
                      <Phone size={16} />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={shippingInfo.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-input-wrap">
                    <label className="checkout-label">
                      <Mail size={16} />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="Nhập email"
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-input-wrap checkout-input-full">
                    <label className="checkout-label">
                      <MapPin size={16} />
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, khu vực nhận hàng"
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-input-wrap checkout-input-full">
                    <label className="checkout-label">Ghi chú</label>
                    <textarea
                      name="note"
                      value={shippingInfo.note}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                      className="checkout-textarea"
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-card">
                <div className="checkout-section-head">
                  <div className="checkout-section-icon">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="checkout-card-title">
                      Phương thức thanh toán
                    </h2>
                    <p className="checkout-card-subtitle">
                      Chọn hình thức thanh toán phù hợp với bạn.
                    </p>
                  </div>
                </div>

                <div className="payment-method-list">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`payment-method-item ${
                        paymentMethod === method.id ? "active" : ""
                      }`}
                    >
                      <div className="payment-method-radio">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                        />
                      </div>

                      <div className="payment-method-icon">{method.icon}</div>

                      <div className="payment-method-body">
                        <div className="payment-method-name">{method.name}</div>
                        <p className="payment-method-description">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="checkout-right">
              <div className="checkout-card checkout-summary">
                <div className="checkout-summary-top">
                  <div>
                    <h2 className="checkout-card-title">Đơn hàng của bạn</h2>
                    <p className="checkout-card-subtitle">
                      Tóm tắt các sản phẩm trà bạn đã chọn.
                    </p>
                  </div>
                  <div className="checkout-badge">
                    {products.length} sản phẩm
                  </div>
                </div>

                <div className="checkout-product-list">
                  {products.map((item) => {
                    const product = item.productId;
                    const price = product?.priceProduct || 0;
                    const discount = product?.discountProduct || 0;
                    const priceAfterDiscount = price - (price * discount) / 100;
                    const subtotal = priceAfterDiscount * item.quantity;

                    return (
                      <div key={item._id} className="checkout-product-item">
                        <div className="checkout-product-image-wrap">
                          <img
                            src={
                              product?.imagesProduct?.[0] ||
                              "https://via.placeholder.com/200x240?text=Tea"
                            }
                            alt={product?.nameProduct}
                            className="checkout-product-image"
                          />
                        </div>

                        <div className="checkout-product-info">
                          <h4 className="checkout-product-name">
                            {product?.nameProduct}
                          </h4>
                          <p className="checkout-product-quantity">
                            Số lượng: {item.quantity}
                          </p>
                          <p className="checkout-product-price">
                            {formatPrice(subtotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="checkout-total-section">
                  <div className="checkout-row">
                    <span>Tạm tính</span>
                    <span className="font-semibold">
                      {formatPrice(cart.totalPrice)}
                    </span>
                  </div>

                  {cart.couponId && (
                    <div className="checkout-row discount">
                      <span>Giảm giá</span>
                      <span className="font-semibold">
                        -{formatPrice(cart.totalPrice - cart.finalPrice)}
                      </span>
                    </div>
                  )}

                  <div className="checkout-row">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">Miễn phí</span>
                  </div>

                  <div className="checkout-final-total">
                    <span>Tổng cộng</span>
                    <span className="checkout-final-price">
                      {formatPrice(
                        cart.couponId ? cart.finalPrice : cart.totalPrice,
                      )}
                    </span>
                  </div>
                </div>

                <button type="submit" className="checkout-submit-btn">
                  Xác nhận đặt hàng
                </button>

                <p className="checkout-secure-note">
                  Đơn hàng của bạn sẽ được xử lý an toàn và xác nhận ngay sau
                  khi thanh toán thành công.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
