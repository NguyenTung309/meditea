import { useEffect, useState } from "react";
import { Rate, Form, Input, Button, message, Divider, Avatar, Empty, Spin } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { getReviewsByProduct, createReview } from "../../config/SellerRequest";

const { TextArea } = Input;

/**
 * ProductReviews — hiển thị đánh giá sản phẩm + form gửi đánh giá
 * Props: productId (string)
 */
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await getReviewsByProduct(productId);
      setReviews(res?.metadata || []);
    } catch {
      // nếu lỗi thì chỉ bỏ qua
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createReview({ productId, rating: values.rating, comment: values.comment });
      message.success("Đánh giá của bạn đã được gửi!");
      form.resetFields();
      fetchReviews();
    } catch (err) {
      if (err?.errorFields) return;
      const msg = err?.response?.data?.message || "";
      if (msg.includes("đã đánh giá") || msg.includes("duplicate")) {
        message.warning("Bạn đã đánh giá sản phẩm này rồi");
      } else if (err?.response?.status === 401) {
        message.warning("Vui lòng đăng nhập để đánh giá sản phẩm");
      } else {
        message.error(msg || "Gửi đánh giá thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <Divider />
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        Đánh giá sản phẩm
      </h2>

      {/* Tổng quan đánh giá */}
      {reviews.length > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 24, padding: "12px 20px",
          background: "#fffbe6", borderRadius: 10,
          border: "1px solid #ffe58f", width: "fit-content"
        }}>
          <StarFilled style={{ color: "#faad14", fontSize: 28 }} />
          <div>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#faad14" }}>{avgRating}</span>
            <span style={{ fontSize: 14, color: "#888", marginLeft: 6 }}>/ 5</span>
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            ({reviews.length} đánh giá)
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>
      ) : reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!" style={{ marginBottom: 24 }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {reviews.map((r) => (
            <div key={r._id} style={{
              background: "#fafafa", borderRadius: 12,
              padding: "14px 18px", border: "1px solid #f0f0f0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.userId?.fullName || "Người dùng"}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{dayjs(r.createdAt).format("DD/MM/YYYY")}</div>
                </div>
                <Rate disabled value={r.rating} style={{ fontSize: 14, marginLeft: "auto" }} />
              </div>
              {r.comment && (
                <p style={{ margin: 0, color: "#444", fontSize: 14 }}>{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form gửi đánh giá */}
      <div style={{
        background: "#f7f9fc", borderRadius: 12,
        padding: "20px 24px", border: "1px solid #e8ecf0"
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
          ✍️ Viết đánh giá của bạn
        </h3>
        <Form form={form} layout="vertical">
          <Form.Item
            name="rating"
            label="Xếp hạng"
            rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét (tùy chọn)">
            <TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." />
          </Form.Item>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            Gửi đánh giá
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ProductReviews;
