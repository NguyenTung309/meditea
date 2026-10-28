import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Divider, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { requestLogin, requestLoginGoogle } from "../../config/UserRequest";
import { adminCheck } from "../../config/AuthRequest";
import { GoogleLogin } from "@react-oauth/google";

/* Tea leaf SVG component */
const TeaLeaf = () => (
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 4C18 4 8 20 8 36c0 12 8 24 24 24s24-12 24-24C56 20 46 4 32 4z"
      fill="currentColor"
      opacity="0.6"
    />
    <path
      d="M32 10c0 0 0 40 0 46"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M32 20c-8 4-14 10-14 18"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M32 20c8 4 14 10 14 18"
      stroke="rgba(255,255,255,0.2)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await requestLoginGoogle({ token: credentialResponse.credential });

      const user = res?.metadata?.user;
      const accessToken = res?.metadata?.accessToken;
      const refreshToken = res?.metadata?.refreshToken;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userChanged"));
      }

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user?.isAdmin) {
        message.success("Đăng nhập Admin thành công!");
        navigate("/admin");
      } else {
        message.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await requestLogin({
        login: values.login?.trim(),
        password: values.password,
      });

      const user = res?.metadata?.user;
      const accessToken = res?.metadata?.accessToken;
      const refreshToken = res?.metadata?.refreshToken;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userChanged"));
      }

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user?.isAdmin) {
        message.success("Đăng nhập Admin thành công!");
        navigate("/admin");
      } else {
        message.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Vui lòng kiểm tra lại thông tin!");
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="auth-page">
      {/* Animated background elements */}
      <div className="tea-leaf tea-leaf--1">
        <TeaLeaf />
      </div>
      <div className="tea-leaf tea-leaf--2">
        <TeaLeaf />
      </div>
      <div className="tea-leaf tea-leaf--3">
        <TeaLeaf />
      </div>
      <div className="tea-leaf tea-leaf--4">
        <TeaLeaf />
      </div>
      <div className="tea-leaf tea-leaf--5">
        <TeaLeaf />
      </div>
      <div className="tea-leaf tea-leaf--6">
        <TeaLeaf />
      </div>
      <div className="tea-steam tea-steam--1" />
      <div className="tea-steam tea-steam--2" />
      <div className="tea-steam tea-steam--3" />
      <div className="auth-circle auth-circle--1" />
      <div className="auth-circle auth-circle--2" />
      <div className="auth-circle auth-circle--3" />

      <div className="auth-card">
        {/* Logo & Branding */}
        <div className="auth-logo">
          {/* <div className="auth-logo-icon">🍵</div> */}

          <h1 className="auth-logo-title">Đăng nhập</h1>
          <br />
          <p className="auth-logo-subtitle">Chào mừng bạn trở lại MediTea</p>
        </div>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email hoặc số điện thoại"
            name="login"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email hoặc số điện thoại!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập email hoặc số điện thoại"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          <div className="auth-row">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Nhớ mật khẩu</Checkbox>
            </Form.Item>
            <div className="auth-forgot-link">
              <Button type="link" onClick={() => navigate("/forgot-password")}>
                Quên mật khẩu?
              </Button>
            </div>
          </div>

          <Form.Item>
            <Button
              className="auth-btn-primary"
              htmlType="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider className="auth-divider" plain>
            hoặc
          </Divider>

          <div className="google-login-container" style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "10px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    message.error("??ng nh?p Google th?t b?i!");
                  }}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
          </div>
        </Form>

        <div className="auth-bottom-link">
          <span>Chưa có tài khoản? </span>
          <Button type="link" onClick={() => navigate("/register")}>
            Đăng ký ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
