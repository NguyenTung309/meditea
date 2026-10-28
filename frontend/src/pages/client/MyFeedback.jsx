import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin, Tag, Empty, message } from "antd";
import {
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getMyFeedback } from "../../config/SellerRequest";
import FeedbackModal from "../../components/feedback/FeedbackModal";
import "./myFeedback.css";

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await getMyFeedback();
      setFeedbacks(res?.metadata || []);
    } catch {
      message.error("Không tải được phản hồi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading)
    return (
      <div className="feedback-loading">
        <Spin size="large" tip="Đang tải phản hồi..." />
      </div>
    );

  return (
    <div className="my-feedback-page">
      <div className="my-feedback-container">
        <div className="my-feedback-header">
          <div className="my-feedback-title">
            <MessageOutlined className="my-feedback-icon" />
            <h1>Phản hồi của tôi</h1>
          </div>
          <FeedbackModal
            buttonStyle={{
              borderRadius: 20,
              fontWeight: 600,
            }}
          />
        </div>

        {feedbacks.length === 0 ? (
          <div className="my-feedback-empty">
            <Empty description="Bạn chưa gửi phản hồi nào." />
          </div>
        ) : (
          <div className="my-feedback-list">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-card">
                <div className="feedback-card-top">
                  <div className="feedback-subject">{fb.subject}</div>
                  <Tag
                    icon={
                      fb.status === "replied" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <ClockCircleOutlined />
                      )
                    }
                    color={fb.status === "replied" ? "green" : "orange"}
                  >
                    {fb.status === "replied" ? "Đã trả lời" : "Chờ phản hồi"}
                  </Tag>
                </div>

                <div className="feedback-message">
                  <div className="feedback-label">Nội dung bạn gửi:</div>
                  <p>{fb.message}</p>
                </div>

                {fb.status === "replied" && fb.adminReply && (
                  <div className="feedback-reply">
                    <div className="feedback-reply-label">
                      💬 Phản hồi từ MediTea:
                    </div>
                    <p>{fb.adminReply}</p>
                  </div>
                )}

                <div className="feedback-date">
                  🕐 {dayjs(fb.createdAt).format("DD/MM/YYYY HH:mm")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeedback;
