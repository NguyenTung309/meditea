import React, { useState, useEffect } from "react";
import "./policy.css";

const SHIPPING_ITEMS = [
  {
    title: "1. Thời gian giao hàng ngắn nhất có thể sau khi đặt hàng là bao lâu?",
    content: [
      "Giá cả sẽ thay đổi tùy thuộc vào mặt hàng, số lượng và các tùy chọn đặt hàng. Chúng tôi sẽ xác nhận giá sau khi thảo luận với bạn qua email hoặc điện thoại.",
      "*Vui lòng chờ từ 10 đến 14 ngày để xử lý đơn hàng."
    ]
  },
  {
    title: "2. Về chi phí vận chuyển",
    content: [
      "Đối với các đơn hàng lớn, chúng tôi sẽ chịu chi phí vận chuyển."
    ]
  },
  {
    title: "3. Tôi muốn gửi nó đến nhiều địa chỉ khác nhau.",
    content: [
      "Đối với các đơn hàng lớn và giao hàng đến 10 địa điểm trở lên, chúng tôi sẽ gửi cho bạn một phiếu đăng ký địa chỉ giao hàng. Rất mong bạn vui lòng điền đầy đủ thông tin vào phiếu này."
    ]
  }
];

const SERVICE_ITEMS = [
  {
    title: "1. Tôi nên làm gì nếu mặt hàng tôi muốn mua đã hết hàng?",
    content: [
      "Chúng tôi rất vui được lắng nghe yêu cầu của bạn, vì vậy xin đừng ngần ngại liên hệ với chúng tôi."
    ]
  },
  {
    title: "2. Bạn có thể cấp biên lai không?",
    content: [
      "Bạn có thể tải xuống biên lai hợp lệ theo hóa đơn ở định dạng PDF từ email xác nhận đơn hàng, email thông báo vận chuyển hoặc trang danh sách đơn hàng trong mục Trang của tôi sau khi đơn hàng của bạn đã được giao.",
      "*Cần đăng ký thành viên để sử dụng Trang cá nhân.",
      "*Hóa đơn có thể được cấp sau khi sản phẩm đã được giao."
    ]
  },
  {
    title: "3. Tôi có thể sử dụng mã giảm giá không?",
    content: [
      "Chúng tôi thành thật xin lỗi, nhưng do dịch vụ giao hàng miễn phí cho các đơn hàng lớn, chúng tôi không thể cung cấp thêm các dịch vụ khác."
    ]
  }
];

function FAQ() {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (id) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const renderAccordion = (items, prefix) => (
    <div className="policy-accordion">
      {items.map((item, index) => {
        const id = `${prefix}-${index}`;
        const isActive = openId === id;
        return (
          <div key={id} className={`policy-accordion__item ${isActive ? "active" : ""}`}>
            <button 
              className="policy-accordion__header" 
              onClick={() => toggleAccordion(id)}
            >
              <span className="policy-accordion__icon">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                </svg>
              </span>
              {item.title}
            </button>
            <div className="policy-accordion__content">
              {item.content.map((p, i) => (
                <p key={i} className="policy-accordion__text" style={p.startsWith('*') ? { fontStyle: 'italic', fontSize: '13px', color: '#888' } : {}}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <main className="policy-page">
      <h1 className="policy-page__title">Câu hỏi thường gặp</h1>
      
      <div className="policy-page__container">
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#6b4d3f', marginBottom: '8px', marginTop: '0' }}>Thông tin vận chuyển</h2>
        {renderAccordion(SHIPPING_ITEMS, 'shipping')}
        
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#6b4d3f', marginBottom: '8px', marginTop: '40px' }}>Về dịch vụ</h2>
        {renderAccordion(SERVICE_ITEMS, 'service')}
      </div>
    </main>
  );
}

export default FAQ;
