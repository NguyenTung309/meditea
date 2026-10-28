import React, { useState, useEffect } from "react";
import "./policy.css";

const TERMS_DATA = [
  {
    title: "Lời nói đầu",
    content: [
      "Chào mừng quý khách đến với website của MediTEA. Khi quý khách truy cập và sử dụng dịch vụ trên trang web, đồng nghĩa với việc quý khách đã đọc, hiểu và đồng ý tuân thủ các Điều khoản và Điều kiện dưới đây.",
      "Chúng tôi có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước. Quý khách vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi."
    ]
  },
  {
    title: "Chấp nhận điều khoản",
    content: [
      "Bằng việc đăng ký tài khoản hoặc đặt mua hàng tại MediTEA, quý khách xác nhận rằng mình có đủ năng lực hành vi dân sự để thực hiện các giao dịch mua bán theo quy định của pháp luật Việt Nam.",
      "Trong trường hợp người dùng chưa đủ 18 tuổi, việc truy cập và sử dụng dịch vụ trên website cần phải có sự giám sát của cha mẹ hoặc người giám hộ hợp pháp."
    ]
  },
  {
    title: "Thông tin sản phẩm và giá cả",
    content: [
      "MediTEA nỗ lực để hiển thị thông tin sản phẩm (bao gồm hình ảnh, quy trình chế biến, công dụng, giá cả) một cách chính xác nhất. Tuy nhiên, màu sắc thực tế của sản phẩm có thể khác đôi chút do độ phân giải màn hình của thiết bị quý khách sử dụng.",
      "Giá sản phẩm được niêm yết trên website là giá bán cuối cùng (đã bao gồm thuế GTGT). Giá này có thể thay đổi tùy thuộc vào tời điểm và các chương trình khuyến mãi. Phí vận chuyển (nếu có) sẽ được tính và thông báo trong quá trình thanh toán."
    ]
  },
  {
    title: "Đặt hàng và Thanh toán",
    content: [
      "Quý khách có thể lựa chọn các phương thức thanh toán an toàn như Chuyển khoản ngân hàng hoặc Thanh toán trực tuyến qua cổng VNPay.",
      "Ngay sau khi hệ thống nhận được đơn hàng và thanh toán (đối với phương thức trả trước), MediTEA sẽ gửi email hoặc tin nhắn xác nhận. Thời gian giao hàng phụ thuộc vào vị trí địa lý của quý khách và đối tác vận chuyển."
    ]
  },
  {
    title: "Chính sách đổi trả hàng",
    content: [
      "Chúng tôi áp dụng chính sách đổi trả hàng linh hoạt đối với các sản phẩm trà và dụng cụ thưởng trà khi sản phẩm gặp lỗi do quá trình đóng gói, vận chuyển hoặc chất lượng không đúng như mô tả.",
      "Yêu cầu đổi/trả hàng phải được thực hiện trong vòng 7 ngày kể từ khi nhận hàng. Sản phẩm cần được giữ nguyên bao bì, chưa qua sử dụng."
    ]
  },
  {
    title: "Quyền sở hữu trí tuệ",
    content: [
      "Mọi thông tin, hình ảnh, bài viết, logo và nội dung trên website này đều thuộc quyền sở hữu của Công ty TNHH MediTEA. Việc sao chép, sử dụng hoặc phân phối lại dưới bất kỳ hình thức nào mà không có sự đồng ý bằng văn bản của MediTEA đều vi phạm luật sở hữu trí tuệ pháp luật Việt Nam."
    ]
  },
  {
    title: "Giới hạn trách nhiệm",
    content: [
      "MediTEA không chịu trách nhiệm trong các trường hợp bất khả kháng liên quan đến đường truyền mạng, server, các vấn đề sự cố kỹ thuật phía khách hàng hoặc nhà cung cấp mạng khiến gián đoạn quá trình truy cập.",
      "Trách nhiệm tối đa của MediTEA đối với bất kỳ khiếu nại nào liên quan đến sản phẩm/dịch vụ mua trên website đều không vượt quá số tiền mà quý khách đã thanh toán cho sản phẩm/dịch vụ đó."
    ]
  }
];

export default function TermsOfService() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <main className="policy-page">
      <h1 className="policy-page__title">Điều khoản và điều kiện</h1>
      
      <div className="policy-page__container">
        <div className="policy-accordion">
          {TERMS_DATA.map((item, index) => {
            const isActive = openIndex === index;
            return (
              <div key={index} className={`policy-accordion__item ${isActive ? "active" : ""}`}>
                <button 
                  className="policy-accordion__header" 
                  onClick={() => toggleAccordion(index)}
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
                    <p key={i} className="policy-accordion__text">{p}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
