import { useEffect, useMemo, useState } from "react";
import { Button, InputNumber, Spin, message, Empty, Popconfirm, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { Leaf, ShoppingBag, TicketPercent } from "lucide-react";
import {
  requestDeleteProductCart,
  requestGetCart,
  requestUpdateQuantity,
  requestApplyCounpon,
} from "../../config/CartRequest";
import "./cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await requestGetCart();
      console.log("GET CART RES =", res);
      setCart(res?.metadata?.cart || null);
      setCoupons(res?.metadata?.coupons || []);
    } catch (error) {
      console.log(error);
      message.error("Không tải được giỏ hàng");
      setCart(null);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.warning("Vui lòng đăng nhập để mua sắm");
      navigate("/login", { replace: true });
      return;
    }
    fetchCart();
  }, [navigate]);

  const items = cart?.products || [];

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = item.productId || {};
      const price = Number(product.priceProduct || 0);
      const discount = Number(product.discountProduct || 0);
      const qty = Number(item.quantity || 1);
      const finalPrice = price - (price * discount) / 100;
      return sum + finalPrice * qty;
    }, 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  }, [items]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await requestUpdateQuantity({
        productId,
        newQuantity,
      });
      message.success("Cập nhật số lượng thành công");
      fetchCart();
    } catch (error) {
      console.log(error);
      message.error(
        error?.response?.data?.message || "Cập nhật số lượng thất bại",
      );
    }
  };

  const handleDelete = async (productId) => {
    try {
      await requestDeleteProductCart(productId);
      message.success("Xóa sản phẩm khỏi giỏ hàng thành công");
      fetchCart();
    } catch (error) {
      console.log(error);
      message.error(error?.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      return message.warning("Vui lòng nhập mã giảm giá");
    }
    setApplyingCoupon(true);
    try {
      await requestApplyCounpon({ couponCode: couponCode.trim() });
      message.success("Áp dụng mã giảm giá thành công");
      setCouponCode("");
      fetchCart();
    } catch (error) {
      message.error(error?.response?.data?.message || "Áp dụng mã giảm giá thất bại");
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="cartLoading">
        <Spin size="large" tip="Đang chuẩn bị giỏ trà của bạn..." />
      </div>
    );
  }

  return (
      <div className="cartPage">
        <div className="cartDecor cartDecorLeft" />
        <div className="cartDecor cartDecorRight" />

        <div className="cartWrap">
          <div className="cartHeader">
            <div className="cartEyebrow">MediTea Cart</div>
            <h2 className="cartTitle">Giỏ trà của bạn</h2>
            <p className="cartSubtitle">
              Xem lại những sản phẩm bạn đã chọn trước khi tiếp tục tới bước
              thanh toán.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="cartEmptyBox">
              <Empty
                description="Chưa có sản phẩm trong giỏ hàng"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <Button
                type="primary"
                className="cartPrimaryBtn"
                onClick={() => navigate("/shop")}
              >
                Khám phá sản phẩm trà
              </Button>
            </div>
          ) : (
            <div className="cartContainer">
              <div className="cartLeft">
                {items.map((item) => {
                  const product = item.productId || {};
                  const image =
                    product.imagesProduct?.[0] ||
                    "https://via.placeholder.com/200x240?text=Tea";
                  const price = Number(product.priceProduct || 0);
                  const discount = Number(product.discountProduct || 0);
                  const quantity = Number(item.quantity || 1);
                  const finalPrice = price - (price * discount) / 100;

                  return (
                    <div className="cartItem" key={product._id}>
                      <div className="cartItemImageWrap">
                        <img src={image} alt={product.nameProduct} />
                      </div>

                      <div className="cartItemInfo">
                        <div className="cartItemBadge">
                          <Leaf size={14} />
                          Trà tuyển chọn
                        </div>

                        <h4>{product.nameProduct}</h4>

                        <p>
                          {product.descriptionProduct ||
                            "Dòng trà được lựa chọn cho trải nghiệm thanh vị, nhẹ nhàng và thư giãn mỗi ngày."}
                        </p>

                        <div className="cartItemMeta">
                          <span className="cartUnitPrice">
                            Đơn giá: {finalPrice.toLocaleString("vi-VN")}đ
                          </span>

                          {discount > 0 && (
                            <span className="cartDiscountTag">
                              Giảm {discount}%
                            </span>
                          )}
                        </div>

                        <div className="cartActions">
                          <Popconfirm
                            title="Xóa sản phẩm này khỏi giỏ hàng?"
                            onConfirm={() => handleDelete(product._id)}
                          >
                            <button>Xóa khỏi giỏ</button>
                          </Popconfirm>
                        </div>
                      </div>

                      <div className="cartItemRight">
                        <div className="cartQuantityLabel">Số lượng</div>

                        <InputNumber
                          min={1}
                          value={quantity}
                          onChange={(value) =>
                            handleUpdateQuantity(product._id, value || 1)
                          }
                        />

                        <div className="cartPrice">
                          {(finalPrice * quantity).toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cartSummary">
                <div className="cartSummaryIcon">
                  <ShoppingBag size={18} />
                </div>

                <h3>Tóm tắt đơn hàng</h3>
                <p className="cartSummaryText">
                  Kiểm tra nhanh các sản phẩm trà trong giỏ trước khi tiến hành
                  thanh toán.
                </p>

                <div className="summaryRow">
                  <span>Tổng dòng sản phẩm</span>
                  <span>{items.length}</span>
                </div>

                <div className="summaryRow">
                  <span className="summaryInline">
                    <TicketPercent size={15} />
                    Mã giảm giá khả dụng
                  </span>
                  <span>{coupons.length}</span>
                </div>

                <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onPressEnter={handleApplyCoupon}
                  />
                  <Button
                    type="primary"
                    onClick={handleApplyCoupon}
                    loading={applyingCoupon}
                    style={{ backgroundColor: "#00b894", borderColor: "#00b894" }}
                  >
                    Áp dụng
                  </Button>
                </div>

                {cart?.couponId && (
                  <div className="summaryRow" style={{ color: "#00b894" }}>
                    <span>Đã giảm</span>
                    <span style={{ fontWeight: "bold" }}>
                      -{(cart.totalPrice - cart.finalPrice).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}

                <div className="summaryRow">
                  <span>Vận chuyển</span>
                  <span>Miễn phí</span>
                </div>

                <div className="summaryRow total">
                  <span>Tổng cộng</span>
                  <span>{(cart?.couponId ? cart?.finalPrice : totalPrice).toLocaleString("vi-VN")}đ</span>
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  className="cartCheckoutBtn"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán
                </Button>

                <button
                  className="cartContinueBtn"
                  onClick={() => navigate("/shop")}
                  type="button"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

export default Cart;
