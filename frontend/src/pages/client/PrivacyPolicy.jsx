import React, { useState, useEffect } from "react";
import "./policy.css";

const PRIVACY_DATA = [
  {
    title: "Lời nói đầu",
    content: [
      "Chính sách Bảo mật giải thích về cách chúng tôi thu thập và sử dụng thông tin của bạn cũng như các lựa chọn của bạn về dữ liệu cá nhân được sử dụng. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ quyền riêng tư cũng như bảo mật dữ liệu cá nhân mà bạn cung cấp khi bạn gọi điện thoại, khi truy cập trang web và các trang mạng xã hội của chúng tôi, hoặc khi bạn sử dụng các phần mềm đặt hàng. Chúng tôi nhận thức rõ trách nhiệm của mình trong việc giữ an toàn các dữ liệu và tuân thủ luật pháp hiện hành về quyền riêng tư và bảo vệ dữ liệu.",
      "Vui lòng đọc kỹ về chính sách bảo mật trước khi sử dụng website của chúng tôi. Website có thể chứa các đường liên kết đến các trang web khác ngoài sự kiểm soát của chúng tôi. MediTEA không chịu trách nhiệm về tính bảo mật của các trang web này. Nếu bạn truy cập các trang web đó từ trang web của chúng tôi, bạn nên nghiên cứu chính sách bảo mật của các trang web đó để có thể hiểu về cách họ thu thập, sử dụng và chia sẻ thông tin của bạn."
    ]
  },
  {
    title: "Dữ liệu cá nhân mà chúng tôi thu thập",
    content: [
      "Khi bạn mua hàng, đăng ký tài khoản hoặc liên hệ với chúng tôi, chúng tôi có thể yêu cầu bạn cung cấp một số thông tin cá nhân nhất định, bao gồm: Họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng và thông tin thanh toán.",
      "Chúng tôi cũng thu thập thông tin tự động khi bạn tương tác với trang web, chẳng hạn như lịch sử duyệt web, loại thiết bị, hệ điều hành, địa chỉ IP và các thông tin liên quan đến các sản phẩm bạn đã xem hoặc thêm vào giỏ hàng."
    ]
  },
  {
    title: "Cách chúng tôi sử dụng thông tin của bạn",
    content: [
      "Thông tin cá nhân của bạn được chúng tôi sử dụng cho các mục đích chính sau đây:",
      "- Xử lý đơn đặt hàng, giao hàng và thanh toán một cách an toàn và nhanh chóng.",
      "- Cung cấp dịch vụ chăm sóc khách hàng, hỗ trợ đổi trả và giải đáp các thắc mắc của bạn.",
      "- Cải thiện trải nghiệm mua sắm trên website thông qua việc phân tích hành vi người dùng.",
      "- Gửi thông tin về các chương trình khuyến mãi, sản phẩm mới (chỉ khi bạn đồng ý nhận thông báo)."
    ]
  },
  {
    title: "Tiết lộ thông tin của bạn",
    content: [
      "Chúng tôi cam kết không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại. Thông tin của bạn chỉ được chia sẻ trong các trường hợp thật sự cần thiết sau:",
      "- Cung cấp cho đối tác vận chuyển để thực hiện việc giao hàng.",
      "- Cung cấp cho các cổng thanh toán trực tuyến để xử lý giao dịch.",
      "- Cung cấp cho cơ quan pháp luật khi có yêu cầu hợp lệ theo quy định của nhà nước Việt Nam."
    ]
  },
  {
    title: "Bảo mật",
    content: [
      "Chúng tôi bảo vệ thông tin của bạn bằng các biện pháp an ninh mạng kỹ thuật số tiên tiến. Dữ liệu nhạy cảm như mật khẩu hay thông tin thẻ tín dụng sẽ được mã hoá để đảm bảo an toàn tối đa.",
      "Tuy nhiên, không có phương thức truyền dẫn nào qua Internet là an toàn tuyệt đối. Mặc dù chúng tôi cố gắng bảo vệ tốt nhất dữ liệu cá nhân của bạn, chúng tôi không thể đảm bảo an toàn tuyệt đối cho thông tin được truyền lên trang web của chúng tôi."
    ]
  },
  {
    title: "Quyền lợi của bạn",
    content: [
      "Bạn có quyền yêu cầu truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách cập nhật thông tin trong mục Quản lý tài khoản hoặc liên hệ trực tiếp với bộ phận Chăm sóc khách hàng của MediTEA.",
      "Bạn cũng có quyền từ chối nhận các email tiếp thị bằng cách nhấp vào liên kết 'Hủy đăng ký' ở phần cuối của bất kỳ email quảng cáo nào."
    ]
  },
  {
    title: "Chính sách Cookies",
    content: [
      "Trang web của chúng tôi sử dụng Cookies để nhớ trạng thái đăng nhập, lưu trữ giỏ hàng và tối ưu trải nghiệm của bạn. Bạn có quyền điều chỉnh cài đặt trình duyệt để từ chối Cookies, nhưng điều này có thể làm giảm một số tính năng trên trang web."
    ]
  }
];

export default function PrivacyPolicy() {
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
      <h1 className="policy-page__title">Chính sách bảo mật</h1>
      
      <div className="policy-page__container">
        <div className="policy-accordion">
          {PRIVACY_DATA.map((item, index) => {
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
