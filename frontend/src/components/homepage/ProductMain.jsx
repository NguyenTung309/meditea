import { useState } from "react";
import "../../App.css";
import { useContent } from "../hooks/useContent";

export default function ProductMain() {
  const { content: cvContent } = useContent("core_values");
  const { content: teaContent } = useContent("tea_collection");
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <>
      <section className="experience" id="product-main-section">
        <div className="experience__header scroll-reveal">
          <h2 className="experience__heading">{teaContent?.title || "Bộ Sưu Tập Trà"}</h2>
          <p className="experience__desc">
            {teaContent?.text || "Không phải lá non hái sớm. MediTea chọn lá trà 1–3 năm tuổi từ vùng cao."}
          </p>
        </div>

        <div className="experience__gallery">
          {[0, 1, 2].map((idx) => {
            const images = [teaContent?.image, teaContent?.image2, teaContent?.image3];
            const fallbacks = [
              "https://images.meditea.vn/images/sp1.png",
              "https://images.meditea.vn/images/sp3.png",
              "https://images.meditea.vn/images/sp2.png",
            ];
            const step = teaContent?.steps?.[idx] || {};
            const scrollClass = idx === 0 ? "scroll-reveal-left" : idx === 2 ? "scroll-reveal-right" : "scroll-reveal";
            return (
              <div className={`experience__card ${scrollClass}`} key={idx}
                style={{ transitionDelay: `${0.1 + idx * 0.2}s` }}>
                <div className="experience__card-img">
                  <img loading="lazy"
                    src={images[idx] || fallbacks[idx]}
                    alt={step.desc || `San pham ${idx + 1}`}
                  />
                </div>
                <h3 className="experience__card-title-bottom">
                  {step.title || `San pham ${idx + 1}`}
                </h3>
                <div className="experience__card-hover-content">
                  <h3 className="experience__card-title">
                    {step.desc || ``}
                  </h3>
                  <p className="experience__card-desc">
                    {step.icon || ``}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="scroll-reveal" style={{ textAlign: "center", marginTop: "60px" }}>
          <a href="/shop" className="story__link">
            VỀ SẢN PHẨM CỦA MEDITEA
          </a>
        </div>
      </section>

{/* NEW SECTION: LÁ TRÀ GIÀ NGUYÊN BẢN */}
      <section className="core-values">
        <div className="core-values__container">
          {/* Left side: text, grid, buttons */}
          <div className="core-values__left scroll-reveal-left">
            <h2 className="core-values__title">{cvContent?.title || "MEDITEA \u2013 LÁ TRÀ GIÀ NGUYÊN BẢN"}</h2>
            <p className="core-values__desc">
              {cvContent?.text || "Không phải lá non hái sớm. MediTea chọn lá trà 1–3 năm tuổi từ vùng cao – nơi sương gió và khí hậu khắc nghiệt giúp lá trà dày, đậm vị và tích tụ hương tự nhiên."}
            </p>

            <div className="core-values__grid">
              {[
                { num: "1", text: "Thu hái lá già vùng cao" },
                { num: "2", text: "Sao sấy thủ công từng mẻ nhỏ" },
                { num: "3", text: "Vị trà nguyên bản – dậy hương tự nhiên" },
                { num: "4", text: "Khám phá hành trình làm trà" },
              ].map((item, i) => (
                <div className="core-value-item" key={i}>
                  <span className="core-value-item__num">{item.num}</span>
                  <span className="core-value-item__text">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="core-values__actions">
              <button
                onClick={() => setVideoOpen(true)}
                className="core-values__btn core-values__btn--dark"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Khám phá xưởng làm trà
                <span className="core-values__btn-icon">›</span>
              </button>
              <a
                href="/bancha-detail"
                className="core-values__btn core-values__btn--light"
              >
                Tìm hiểu thêm
                <span className="core-values__btn-icon">›</span>
              </a>
            </div>
          </div>

          {/* Right side: images */}
          <div className="core-values__right">
            <div className="core-values__img-small scroll-reveal-right">
              <img loading="lazy" src={cvContent?.image2 || "https://images.meditea.vn/images/tea_leaves.png"} alt="Thu hái lá trà" />
            </div>
            <div className="core-values__img-large scroll-reveal">
              <img loading="lazy" src={cvContent?.image || "https://images.meditea.vn/images/tea_plantation.png"} alt="Xưởng trà" />
            </div>
          </div>
        </div>
      </section>

      {videoOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
            backgroundColor: "rgba(0,0,0,0.85)", zIndex: 100000, 
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setVideoOpen(false)}
        >
          <div 
            style={{
              position: 'relative', width: '90%', maxWidth: '1000px',
              backgroundColor: '#000',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={{
                position: 'absolute', top: '-50px', right: '-10px', 
                background: 'transparent', border: 'none', color: '#fff', 
                fontSize: '40px', cursor: 'pointer', padding: '10px',
                transition: 'opacity 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
              onClick={() => setVideoOpen(false)}
            >
              ×
            </button>
            <video src="https://images.meditea.vn/images/VR_X.mp4" controls autoPlay style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      )}
    </>
  );
}
