// pages/auth/Register.jsx
import React, { useState } from "react";
import { Button, Form, Input, Radio, message, DatePicker } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { requestRegister } from "../../config/UserRequest";
import "./AuthPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        // ✅ khớp backend
        fullName: values.fullName?.trim(),
        email: values.email?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        password: values.password,

        // ✅ schema required String
        dob: values.dob ? dayjs(values.dob).format("DD/MM/YYYY") : "",

        // ✅ schema required String: dùng ngày hiện tại làm "date"
        date: dayjs().format("DD/MM/YYYY"),

        // ✅ schema có isAdmin (default false), vẫn gửi để khớp backend
        isAdmin: false,
      };

      await requestRegister(payload);

      message.success("Đăng kí thành công!");
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Đăng kí thất bại!";
      message.error(msg);
      console.log("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("Vui lòng kiểm tra lại thông tin!");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🍵</div>
          <h1 className="auth-logo-title">Đăng ký tài khoản</h1>
          <p className="auth-logo-subtitle">
            Tham gia cùng MediTea ngay hôm nay
          </p>
        </div>

        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* ✅ fullName (đúng backend) */}
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>

          {/* ✅ dob (String required, FE chọn bằng DatePicker rồi format) */}
          <Form.Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* gender không có trong backend => giữ cũng được nhưng không gửi */}
          <Form.Item label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9+\-\s()]{8,20}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="auth-btn-primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Đăng ký tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-bottom-link">
          <span>Đã có tài khoản? </span>
          <Button type="link" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
