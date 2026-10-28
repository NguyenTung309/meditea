const nodemailer = require("nodemailer");
require("dotenv").config();

function buildOrderHtml(order) {
  const itemsHtml = (order.products || [])
    .map(
      (p) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${p.productId?.nameProduct || "Sản phẩm"}</td><td style="padding:8px;border-bottom:1px solid #eee">x${p.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee">${(p.productId?.priceProduct || 0).toLocaleString("vi-VN")}đ</td></tr>`
    )
    .join("");

  const total = (order.finalPrice || order.totalPrice || 0).toLocaleString("vi-VN");

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head><meta charset="UTF-8"><style>
      body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
      .container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
      .header{background:#7ca844;padding:20px;color:#fff;text-align:center}
      .header h2{margin:0;font-size:20px}
      .content{padding:20px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th{background:#f8f8f8;padding:8px;text-align:left}
      .info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0}
      .total{font-size:18px;font-weight:700;color:#7ca844;text-align:right;margin-top:12px}
      .footer{text-align:center;padding:16px;font-size:12px;color:#888}
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h2>MediTea - Xác nhận đơn hàng</h2></div>
        <div class="content">
          <p>Xin chào <strong>${order.fullName}</strong>,</p>
          <p>Cảm ơn bạn đã đặt hàng tại MediTea. Thông tin đơn hàng:</p>
          <div class="info-row"><span>Mã đơn:</span><strong>${order._id}</strong></div>
          <div class="info-row"><span>Ngày mua:</span><strong>${new Date(order.createdAt).toLocaleString("vi-VN")}</strong></div>
          <div class="info-row"><span>Phương thức:</span><strong>${order.paymentMethod?.toUpperCase()}</strong></div>
          <div class="info-row"><span>Trạng thái:</span><strong>${order.status}</strong></div>
          <table><tr><th>Sản phẩm</th><th>Số lượng</th><th>Thành tiền</th></tr>${itemsHtml}</table>
          <div class="total">Tổng cộng: ${total}đ</div>
          <p><strong>Địa chỉ nhận:</strong> ${order.address}</p>
          <p><strong>SĐT:</strong> ${order.phoneNumber}</p>
        </div>
        <div class="footer">Trân trọng,<br/><strong>MediTea</strong></div>
      </div>
    </body>
    </html>`;
}

function buildAdminHtml(order) {
  const total = (order.finalPrice || order.totalPrice || 0).toLocaleString("vi-VN");
  return `
    <!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><style>
      body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
      .container{max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
      .header{background:#2a3b22;padding:20px;color:#fff;text-align:center}
      .header h2{margin:0;font-size:20px}
      .content{padding:20px}
      .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0}
      .footer{text-align:center;padding:16px;font-size:12px;color:#888}
    </style></head>
    <body>
      <div class="container">
        <div class="header"><h2>Thông báo đơn hàng mới</h2></div>
        <div class="content">
          <div class="info-row"><span>Khách hàng:</span><strong>${order.fullName}</strong></div>
          <div class="info-row"><span>Email:</span><strong>${order.email}</strong></div>
          <div class="info-row"><span>SĐT:</span><strong>${order.phoneNumber}</strong></div>
          <div class="info-row"><span>Mã đơn:</span><strong>${order._id}</strong></div>
          <div class="info-row"><span>Ngày mua:</span><strong>${new Date(order.createdAt).toLocaleString("vi-VN")}</strong></div>
          <div class="info-row"><span>Tổng tiền:</span><strong>${total}đ</strong></div>
          <div class="info-row"><span>Phương thức:</span><strong>${order.paymentMethod?.toUpperCase()}</strong></div>
          <div class="info-row"><span>Địa chỉ:</span><strong>${order.address}</strong></div>
        </div>
        <div class="footer">MediTea - Hệ thống tự động</div>
      </div>
    </body></html>`;
}

function getTransport() {
  const emailUser = process.env.EMAIL_USER || "tralagiameditea@gmail.com";
  const emailPass = process.env.EMAIL_PASS || "";

  if (emailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });
  }
  return null;
}

const sendOrderMail = async (order) => {
  try {
    const transport = getTransport();
    if (!transport) { console.log("No EMAIL_PASS configured - skipping order email"); return; }
    await transport.sendMail({
      from: `"MediTea" <${process.env.EMAIL_USER || "tralagiameditea@gmail.com"}>`,
      to: order.email,
      subject: "MediTea - Xác nhận đơn hàng",
      html: buildOrderHtml(order),
    });
    console.log("Order confirmation email sent to:", order.email);
  } catch (error) {
    console.log("Error sending order email:", error.message);
  }
};

const sendAdminNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || "tralagiamedi@gmail.com";
  try {
    const transport = getTransport();
    if (!transport) { console.log("No EMAIL_PASS configured - skipping admin notification"); return; }
    await transport.sendMail({
      from: `"MediTea" <${process.env.EMAIL_USER || "tralagiameditea@gmail.com"}>`,
      to: adminEmail,
      subject: `Đơn hàng mới - ${order.fullName}`,
      html: buildAdminHtml(order),
    });
    console.log("Admin notification sent to:", adminEmail);
  } catch (error) {
    console.log("Error sending admin notification:", error.message);
  }
};

module.exports = { sendOrderMail, sendAdminNotification };
