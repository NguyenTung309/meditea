import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Steps } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  requestForgotPassword,
  requestVerifyForgotPassword,
  requestVerifyOtp,
  // nếu bạn có api verify otp riêng thì import thêm:
  // requestVerifyOtp,
} from "../../config/UserRequest";
import "./AuthPage.css";

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

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // lưu state để hiển thị, nhưng submit sẽ lấy từ Form values
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const [formEmail] = Form.useForm();
  const [formOtp] = Form.useForm();
  const [formReset] = Form.useForm();

  // clear interval khi unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(60);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===== STEP 1: Send OTP (theo logic dưới) =====
  const handleSendOtp = async (values) => {
    const emailTrim = (values?.email || "").trim();
    if (!emailTrim) return;

    setLoading(true);
    try {
      await requestForgotPassword({ email: emailTrim });

      setEmail(emailTrim);
      message.success("Mã OTP đã được gửi đến email của bạn!");
      setCurrentStep(1);
      startCountdown();
    } catch (error) {
      const msg = error?.response?.data?.message || "Email không tồn tại!";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 2: Verify OTP =====
  // Logic “2 đoạn dưới” thực tế KHÔNG verify riêng,
  // mà verify + đổi pass làm chung trong requestVerifyForgotPassword.
  // Vì bạn đang có 3 bước UI, mình cho Step 2 chỉ để “validate” OTP ở FE:
  // - Nếu bạn có endpoint verify OTP riêng thì gọi ở đây
  // - Nếu không có, cho phép qua bước 3 luôn
  const handleVerifyOtp = async (values) => {
    const otpVal = String(values?.otp || "").trim();

    if (!otpVal || otpVal.length !== 6) {
      message.warning("Vui lòng nhập đầy đủ mã OTP 6 số!");
      return;
    }

    setLoading(true);
    try {
      await requestVerifyOtp({ otp: otpVal }); // ✅ verify thật với backend

      setOtp(otpVal);
      message.success("OTP đúng! Bạn có thể đặt mật khẩu mới.");
      setCurrentStep(2); // ✅ chỉ sang bước 3 khi OTP đúng
    } catch (error) {
      message.error("Mã OTP không đúng vui lòng nhập lại");

      formOtp.setFields([{ name: "otp", errors: [msg] }]);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 3: Reset Password (theo logic dưới) =====
  const handleResetPassword = async (values) => {
    const newPass = values?.password;
    const otpVal = otp || String(formOtp.getFieldValue("otp") || "").trim();

    if (!otpVal) {
      message.error("Thiếu OTP. Vui lòng nhập OTP trước.");
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    try {
      // Backend tự lấy token từ Cookie (như code dưới)
      await requestVerifyForgotPassword({
        otp: otpVal,
        password: newPass,
      });

      message.success("Đổi mật khẩu thành công! Đang chuyển về đăng nhập...");
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
    <div className="auth-page">
      {/* Animated background */}
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
        <div className="auth-logo">
          <div className="auth-logo-icon">🔑</div>
          <h1 className="auth-logo-title">Quên mật khẩu</h1>
          <p className="auth-logo-subtitle">Lấy lại mật khẩu qua mã OTP</p>
        </div>

        <div className="auth-steps">
          <Steps
            current={currentStep}
            size="small"
            items={[
              { title: "Email" },
              { title: "OTP" },
              { title: "Mật khẩu mới" },
            ]}
          />
        </div>

        {/* STEP 1 */}
        {currentStep === 0 && (
          <div className="auth-step-content">
            <p className="auth-step-desc">
              Nhập email tài khoản của bạn, chúng tôi sẽ gửi mã OTP để xác nhận.
            </p>

            <Form
              form={formEmail}
              layout="vertical"
              onFinish={handleSendOtp}
              initialValues={{ email }}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="auth-btn-primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Gửi mã OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 1 && (
          <div className="auth-step-content">
            <p className="auth-step-desc">
              Mã OTP đã gửi đến <strong>{email}</strong>. Vui lòng kiểm tra hộp
              thư.
            </p>

            <Form form={formOtp} layout="vertical" onFinish={handleVerifyOtp}>
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[
                  { required: true, message: "Vui lòng nhập mã OTP!" },
                  { len: 6, message: "OTP phải đủ 6 số!" },
                ]}
              >
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="Nhập mã 6 số"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  style={{
                    letterSpacing: "8px",
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="auth-btn-primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Tiếp tục
                </Button>
              </Form.Item>
              {/* 
              <div className="auth-resend-otp">
                {countdown > 0 ? (
                  <span>Gửi lại sau {countdown}s</span>
                ) : (
                  <Button
                    type="link"
                    onClick={() => formEmail.submit()} // gửi lại theo email đã nhập
                    loading={loading}
                  >
                    Gửi lại mã OTP
                  </Button>
                )}
              </div> */}
            </Form>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 2 && (
          <div className="auth-step-content">
            <p className="auth-step-desc">
              Tạo mật khẩu mới cho tài khoản của bạn.
            </p>

            <Form
              form={formReset}
              layout="vertical"
              onFinish={handleResetPassword}
            >
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu mới"
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className="auth-btn-primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

        <div className="auth-bottom-link">
          <span>Nhớ mật khẩu rồi? </span>
          <Button
            type="link"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
