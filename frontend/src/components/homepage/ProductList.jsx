import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import PanoramaViewer from "./PanoramaViewer";
import { useContent } from "../hooks/useContent";

const defaultSteps = [
  { title: "Lá trà đủ tuổi",       desc: "MediTea chọn những lá trà đã ở lại trên cây đủ năm.",                                                  icon: "🌿", img: "https://images.meditea.vn/images/tea_leaves.png",    imgs: ["https://images.meditea.vn/images/tea_leaves.png"] },
  { title: "Chế biến thủ công",    desc: "Chúng tôi sao sấy trà trong từng mẻ nhỏ, kiểm soát nhiệt và thời gian bằng kinh nghiệm.",             icon: "🔥", img: "https://images.meditea.vn/images/sp2.png",           imgs: ["https://images.meditea.vn/images/sp2.png"] },
  { title: "Giữ vị nguyên bản",    desc: "MediTea không sử dụng hương liệu hay phụ gia để điều chỉnh mùi vị.",                                   icon: "🍂", img: "https://images.meditea.vn/images/sp1.png",           imgs: ["https://images.meditea.vn/images/sp1.png"] },
  { title: "Trung thực nguồn gốc", desc: "Mỗi sản phẩm của MediTea đều rõ ràng về vùng trồng, cách thu hái và quy trình chế biến.",             icon: "📍", img: "https://images.meditea.vn/images/sp3.png",           imgs: ["https://images.meditea.vn/images/sp3.png"] },
  { title: "Gắn bó thiên nhiên",   desc: "Trà được sao sấy trong không gian gần gũi cây xanh và ánh sáng tự nhiên.",                            icon: "🌿", img: "https://images.meditea.vn/images/tea_plantation.png", imgs: ["https://images.meditea.vn/images/tea_plantation.png"] },
  { title: "Bền vững dài hạn",     desc: "MediTea theo đuổi sự phát triển ổn định thay vì tăng trưởng nhanh.",                                   icon: "🌱", img: "https://images.meditea.vn/images/anh1.png",          imgs: ["https://images.meditea.vn/images/anh1.png"] },
];

export default function ProductList() {
  const { content } = useContent("values");
  const [activeStep, setActiveStep] = useState(0);
  const [showPanorama, setShowPanorama] = useState(false);
  const [popupStep, setPopupStep] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const closePopup = () => setPopupStep(null);

  // Reset active image when step changes
  useEffect(() => { setActiveImg(0); }, [popupStep]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closePopup(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const FEATURES = content?.steps?.length === 6 ? content.steps : defaultSteps;
  const psDesc = content?.text || "Chúng tôi tin rằng giá trị của trà không nằm ở việc làm khác đi, mà ở việc để lá đủ năm trên cây, quá trình chế biến đủ chậm và hương vị đủ thật khi đến tay người dùng.";

  const row1 = FEATURES.slice(0, 3);
  const row2 = FEATURES.slice(3);

  const renderRow = (items, startIdx) => (
    <div className="process-row">
      <svg className="process-row__line" preserveAspectRatio="none" viewBox="0 0 900 4">
        <line x1="60" y1="2" x2="840" y2="2" stroke="rgba(134,180,63,0.2)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="60" y1="2" x2="840" y2="2" stroke="url(#processGrad)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray="780"
          strokeDashoffset={activeStep >= startIdx && activeStep < startIdx + items.length
            ? Math.max(0, 780 - ((activeStep - startIdx + 1) / items.length) * 780)
            : activeStep >= startIdx + items.length ? 0 : 780}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}/>
        <defs>
          <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a8d450"/><stop offset="100%" stopColor="#5a8a2e"/>
          </linearGradient>
        </defs>
      </svg>
      {items.map((f, i) => {
        const globalIdx = startIdx + i;
        const isActive = activeStep === globalIdx;
        return (
          <div className={`process-node ${isActive ? "process-node--active" : ""}`} key={f.title || i}
            onClick={() => { setActiveStep(globalIdx); setPopupStep(globalIdx); }}>
            <div className="process-node__circle">
              <span className="process-node__num">{String(globalIdx + 1).padStart(2, "0")}</span>
              <span className="process-node__emoji">{f.icon}</span>
            </div>
            <div className="process-node__label">{f.title}</div>
          </div>
        );
      })}
    </div>
  );

  // Get images for the current popup step
  const getStepImgs = (idx) => {
    const s = FEATURES[idx];
    if (!s) return [];
    return (s.imgs && s.imgs.length > 0) ? s.imgs : (s.img ? [s.img] : []);
  };

  const arrowBtn = (label, onClick) => (
    <button
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "1.5px solid #c8ad8e", background: "transparent",
        color: "#957159", fontSize: 18, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s", flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#957159"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#957159"; }}
    >{label}</button>
  );

  return (
    <section className="ps" id="about-section">
      <div className="ps__inner">
        <p className="ps__kicker scroll-reveal">TRIẾT LÝ MEDITEA</p>
        <h2 className="ps__title scroll-reveal">Giá Trị Nguyên Bản</h2>
        <p className="ps__desc scroll-reveal">{psDesc}</p>
        <div className="process-timeline scroll-reveal">
          {renderRow(row1, 0)}
          <div className="process-timeline__bridge">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path d="M20 8 L20 28 M12 22 L20 30 L28 22" fill="none" stroke="rgba(134,180,63,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {renderRow(row2, 3)}
        </div>
        <Link to="/story-2" className="ps__btn scroll-reveal">Tìm hiểu chi tiết <span className="ps__btn-dot" aria-hidden="true"/></Link>
      </div>

      <div className="collection__parallax" style={{ backgroundImage: "url(https://images.meditea.vn/images/bandia.png)" }}>
        <div className="collection__parallax-content scroll-reveal-left">
          <h2 className="collection__parallax-title">TRẢI NGHIỆM</h2>
          <p className="collection__parallax-desc">
            Trà MediTea được làm trong một không gian mở, nơi sân vườn, cây cối và thiên nhiên hòa vào từng công đoạn.
          </p>
          <button className="collection__parallax-link" onClick={() => setShowPanorama(true)}
            style={{ background: "none", border: "2px solid #ebd9b4", color: "#ebd9b4", padding: "12px 28px", borderRadius: "30px", fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "inherit", marginTop: 16, transition: "all 0.3s" }}
            onMouseEnter={(e) => { e.target.style.background = "#ebd9b4"; e.target.style.color = "#3d2e1e"; }}
            onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "#ebd9b4"; }}
          >Khám phá VR 360°</button>
        </div>
      </div>

      {showPanorama && <PanoramaViewer onClose={() => setShowPanorama(false)} />}

      {/* ── STEP MODAL ───────────────────────────────────────────────── */}
      {popupStep !== null && (() => {
        const step = FEATURES[popupStep];
        const stepImgs = getStepImgs(popupStep);
        const goPrev = (e) => { e.stopPropagation(); setPopupStep(s => s === 0 ? FEATURES.length - 1 : s - 1); };
        const goNext = (e) => { e.stopPropagation(); setPopupStep(s => s === FEATURES.length - 1 ? 0 : s + 1); };

        return (
          <div
            onClick={closePopup}
            style={{
              position: "fixed", inset: 0, zIndex: 100000,
              backgroundColor: "rgba(20,15,10,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "12px", backdropFilter: "blur(6px)",
            }}
          >
            <style>{`
              @keyframes _stepImgFade {
                from { opacity: 0; transform: scale(1.04); }
                to   { opacity: 1; transform: scale(1); }
              }
              @keyframes _modalIn {
                from { opacity: 0; transform: translateY(28px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              ._sModal {
                position: relative;
                background: #fff;
                border-radius: 20px;
                width: min(1400px, 96vw);
                height: 92vh;
                box-shadow: 0 40px 100px rgba(0,0,0,0.3);
                overflow: hidden;
                display: flex;
                flex-direction: row;
                animation: _modalIn 0.35s cubic-bezier(0.22,1,0.36,1);
              }
              ._sClose {
                display: none;
                position: absolute;
                top: 12px; right: 12px;
                z-index: 20;
                width: 30px; height: 30px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.92);
                color: #7a5c3a;
                font-size: 16px;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                line-height: 1;
              }
              ._sLeft {
                flex: 0 0 60%;
                background: #f2ede5;
                display: flex;
                flex-direction: column;
                min-height: 0;
                overflow: hidden;
              }
              ._sImgWrap {
                flex: 1;
                overflow: hidden;
                position: relative;
                min-height: 0;
              }
              ._sRight {
                flex: 1;
                padding: 36px 32px;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
              }
              @media (max-width: 680px) {
                ._sModal {
                  flex-direction: column !important;
                  height: 92vh !important;
                  border-radius: 16px !important;
                  overflow-y: auto !important;
                  overflow-x: hidden !important;
                }
                ._sClose { display: flex !important; }
                ._sLeft {
                  flex: none !important;
                  width: 100% !important;
                  height: 58vw !important;
                  min-height: 200px !important;
                  max-height: 290px !important;
                  flex-shrink: 0 !important;
                }
                ._sImgWrap { height: 100% !important; }
                ._sRight {
                  flex: none !important;
                  padding: 16px 16px 28px !important;
                  overflow-y: visible !important;
                }
              }
            `}</style>

            <div onClick={e => e.stopPropagation()} className="_sModal">
              <button className="_sClose" onClick={closePopup}>✕</button>

              {/* LEFT: image + thumbnails */}
              <div className="_sLeft">
                <div className="_sImgWrap">
                  {stepImgs.length > 0 ? (
                    <img
                      key={`${popupStep}-${activeImg}`}
                      src={stepImgs[activeImg]}
                      alt={step.title}
                      loading="eager"
                      style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover", display: "block",
                        animation: "_stepImgFade 0.38s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "#ddd8cf" }} />
                  )}
                </div>

                {stepImgs.length > 1 && (
                  <div style={{ display: "flex", gap: 8, padding: "10px 14px", background: "#e8e2d8", overflowX: "auto", flexShrink: 0 }}>
                    {stepImgs.map((src, i) => (
                      <img
                        key={i} src={src} alt="" loading="lazy"
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: 72, height: 52, objectFit: "cover",
                          borderRadius: 6, cursor: "pointer", flexShrink: 0,
                          border: i === activeImg ? "2px solid #957159" : "2px solid transparent",
                          opacity: i === activeImg ? 1 : 0.65,
                          transition: "opacity 0.2s, border-color 0.2s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: content */}
              <div className="_sRight">
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {arrowBtn("←", goPrev)}
                  {arrowBtn("→", goNext)}
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#bbb", alignSelf: "center" }}>
                    {popupStep + 1} / {FEATURES.length}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#957159", letterSpacing: 3, textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>
                  {step.icon}  Bước {String(popupStep + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#3d2e1e", margin: "0 0 16px", lineHeight: 1.4 }}>
                  {step.title}
                </h3>
                <div style={{ width: 36, height: 2, background: "#957159", marginBottom: 20 }} />
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "#6b5840", margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
