import React, { useEffect, useState } from "react";
import "../../App.css";
import { useScrollReveal } from "../../components/Homepage";
import { Link } from "react-router-dom";

export default function BanchaPage() {
  useScrollReveal();
  const [showVideo, setShowVideo] = useState(false);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bancha-page">
      {/* ===== HERO SECTION ===== */}
      <section className="bancha-hero">
        <div className="bancha-hero__bg">
          <img loading="lazy" src="https://images.meditea.vn/images/anh3.png" alt="Cây trà đặc trưng Bancha" />
          <div className="bancha-hero__overlay"></div>
        </div>
        <div className="bancha-hero__content scroll-reveal">
          <h1 className="bancha-hero__title">
            Trà Bancha — Lá Già Khởi Nguyên
          </h1>
          <p className="bancha-hero__subtitle">
            Cấu trúc ổn định, hương vị sâu thẳm từ những búp trà trưởng thành.
          </p>
        </div>
      </section>

      {/* ===== STORY CONTENT ===== */}
      <section className="bancha-content">
        <div className="about-content__container">
          {/* Intro Block */}
          <div className="bancha-intro scroll-reveal">
            <p className="bancha-intro__text">
              <strong>MediTea thuộc nhóm trà Bancha</strong> – dòng trà được chế
              biến từ những lá trà đủ năm, thường ở vụ thu hoạch thứ hai hoặc
              thứ ba trong năm. Những lá này có kích thước lớn, dày và mang màu
              nâu sậm khi đã qua chế biến. Khác với trà làm từ búp non, Bancha
              khai thác phần lá trưởng thành của cây, nơi cấu trúc đã ổn định và
              hương vị trở nên sâu hơn theo thời gian.
            </p>
          </div>

          {/* Block 1: Flavor */}
          <div className="about-block">
            <div className="about-block__text scroll-reveal-left">
              <h2 className="about-block__heading">
                Hương vị đặc trưng của trà lá già
              </h2>
              <p>
                Trà Bancha mang hương thơm trầm, thoảng mùi gỗ và vỏ cây trong
                lần pha đầu tiên. Khi tiếp tục hãm thêm nhiều lần, vị trà lắng
                lại và trở nên dịu hơn, để lại hậu ngọt nhẹ nhưng bền.
              </p>
              <p>
                Nhờ được làm từ lá già, trà có cấu trúc vị rõ ràng và không quá
                sắc. Đây là loại trà không gây ấn tượng bằng sự bùng nổ ban đầu,
                mà bằng cảm giác êm và sâu khi uống chậm.
              </p>
            </div>
            <div className="about-block__img scroll-reveal-right">
              <img loading="lazy" src="/images/số 11.jpg" alt="Hương vị trà Bancha" />
            </div>
          </div>

          {/* Block 2: Caffeine */}
          <div className="about-block about-block--reverse">
            <div className="about-block__text scroll-reveal-right">
              <h2 className="about-block__heading">Hàm lượng caffeine thấp</h2>
              <p>
                Lá trà già tự nhiên chứa ít caffeine hơn lá non do cơ chế bảo vệ
                của cây trà tập trung nhiều caffeine ở phần búp và lá trẻ. Nhờ
                đó, trà Bancha thường dịu hơn, ít gây cảm giác kích thích mạnh.
              </p>
              <div className="bancha-highlight">
                <span className="bancha-highlight__icon">✦</span>
                <p>
                  MediTea vì thế phù hợp để uống mỗi ngày, kể cả vào buổi chiều,
                  với những người nhạy cảm với caffeine.
                </p>
              </div>
            </div>
            <div className="about-block__img scroll-reveal-left">
              <img loading="lazy" src="/images/số 12.jpg" alt="Trà Bancha ít Caffeine" />
            </div>
          </div>

          {/* Block 3: Natural Value */}
          <div className="about-block">
            <div className="about-block__text scroll-reveal-left">
              <h2 className="about-block__heading">Giá trị tự nhiên của trà</h2>
              <p>
                Giống như các dòng trà xanh truyền thống, trà Bancha vẫn giữ
                được các hợp chất chống oxy hóa tự nhiên có trong lá trà.
              </p>
              <p>
                Khi được chế biến đúng cách, những hợp chất này góp phần tạo nên
                vị chát dịu và cảm giác tỉnh táo nhẹ nhàng sau khi uống. MediTea
                xem đó là một thức uống hỗ trợ lối sống cân bằng và điều độ.
              </p>
            </div>
            <div className="about-block__img about-block__img--tall scroll-reveal-right">
              <img loading="lazy" src="/images/số 13.jpg" alt="Giá trị tự nhiên" />
            </div>
          </div>

          {/* Block 4: Journey */}
          <div className="about-block about-block--reverse">
            <div className="about-block__text scroll-reveal-right">
              <h2 className="about-block__heading">Hành trình làm trà</h2>
              <p>
                Quy trình của MediTea bắt đầu từ việc hái lá già trên cây trà
                Shan Tuyết cổ thụ, tối thiểu từ 3 năm trở lên. Sau khi thu hái,
                lá được tuyển chọn kỹ, loại bỏ những phần sâu hoặc hư hỏng, rồi
                phơi trong bóng râm để lá héo tự nhiên mà vẫn giữ được cấu trúc
                nguyên vẹn.
              </p>
              <p>
                Khi đạt độ héo phù hợp, lá tiếp tục được đưa vào lô sao trà, nơi
                nhiệt độ và thời gian được kiểm soát cẩn trọng để làm dậy hương
                và ổn định hương vị đặc trưng của trà lá già.
              </p>
              <p>
                Vì được làm thủ công theo từng mẻ, hương vị có thể thay đổi rất
                nhẹ giữa các lần sao. Sự khác biệt ấy không phải là sai lệch, mà
                là dấu ấn tự nhiên của quá trình thủ công. Tuy vậy, MediTea vẫn
                đảm bảo sự ổn định về hương thơm và cấu trúc vị đặc trưng – đậm,
                rõ và hậu ngọt bền.
              </p>
            </div>
            <div className="about-block__img scroll-reveal-left">
              <img loading="lazy"
                src="https://images.meditea.vn/images/tea_ceremony.png"
                alt="Quy trình sao trà thủ công"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== VR TOUR BANNER ===== */}
      <section className="bancha-vr-banner scroll-reveal">
        <div className="bancha-vr-banner__content">
          <h2 className="bancha-vr-banner__title">
            Trải nghiệm không gian làm trà
          </h2>
          <p className="bancha-vr-banner__desc">
            Không gian làm trà đặt giữa môi trường nhiều cây xanh ở vùng ngoại
            ô, nơi thiên nhiên không chỉ là khung cảnh mà là một phần của quá
            trình. Bạn có thể trải nghiệm toàn bộ hành trình này thông qua VR
            tour 360°, từ khâu chọn lá đến khi trà hoàn thiện – để hiểu rõ hơn
            điều tạo nên một chén MediTea.
          </p>
          <button onClick={(e) => { e.preventDefault(); setShowVideo(true); }} className="core-values__btn" style={{ backgroundColor: '#957159', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold' }}>
            Tham gia Tour 360°
            <span className="core-values__btn-icon">›</span>
          </button>
        </div>
      </section>

      {/* Call to action at the bottom */}
      <section className="about-cta scroll-reveal">
        <h2 className="about-cta__title">
          Thưởng thức trọn vẹn hương vị Bancha
        </h2>
        <Link
          to="/shop"
          className="core-values__btn core-values__btn--dark"
        >
          Mua ngay
          <span className="core-values__btn-icon">›</span>
        </Link>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button 
            onClick={() => setShowVideo(false)}
            style={{ position: 'absolute', top: '20px', right: '40px', background: 'transparent', border: 'none', color: '#fff', fontSize: '40px', cursor: 'pointer', zIndex: 100000 }}
          >
            ×
          </button>
          <video 
            src="https://images.meditea.vn/images/VR_X.mp4" 
            controls 
            autoPlay 
            style={{ width: '90%', maxWidth: '1200px', maxHeight: '90vh', backgroundColor: '#000' }}
          />
        </div>
      )}
    </div>
  );
}
