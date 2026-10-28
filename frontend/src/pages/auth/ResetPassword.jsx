import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { requestVerifyForgotPassword } from "../../config/UserRequest";

const { Title, Text } = Typography;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gửi otp và password mới lên (Backend tự lấy token từ Cookie)
      await requestVerifyForgotPassword({
        otp: values.otp,
        password: values.password,
      });

      message.success("Mật khẩu của bạn đã được cập nhật!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Mã OTP không đúng hoặc hết hạn!";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
      <Card style={{ width: 420, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Xác nhận OTP
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 20 }}
        >
          Nhập mã 6 số được gửi trong email và mật khẩu mới.
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mã xác thực OTP"
            name="otp"
            rules={[{ required: true, message: "Nhập OTP!" }]}
          >
            <Input size="large" placeholder="Ví dụ: 123456" maxLength={6} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, min: 6, message: "Tối thiểu 6 ký tự!" }]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu không trùng khớp!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Đổi mật khẩu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
