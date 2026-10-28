import React, { useState } from "react";
import "../../App.css";
import { useContent } from "../hooks/useContent";

export default function Certificate() {
  const { content } = useContent("commitment");
  const [isCertOpen, setIsCertOpen] = useState(false);

  const title = content?.title || "CHỨNG NHỌN CHẤT LƯỢNG";
  const desc = content?.text || "MediTea tự hào đạt các chứng nhận uy tín về chất lượng sản phẩm và quy trình sản xuất. Mỗi lá trà đều kể câu chuyện về sự tận tâm và trách nhiệm với thiên nhiên.";
  const certImg = content?.image || "https://images.meditea.vn/images/chungchi1.png";

  return (
    <>
      <section className="commitment" id="certificate-section">
        <div className="commitment__inner">
          <div className="commitment__text scroll-reveal">
            <h2 className="commitment__heading">{title}</h2>
            <p className="commitment__desc">{desc}</p>
          </div>
          <div
            className="commitment__img scroll-reveal-right"
          style={{ height: "auto" }}
            style={{ transitionDelay: "0.3s", cursor: "pointer" }}
            onClick={() => setIsCertOpen(true)}
          >
            <div style={{
              border: "4px solid #957159", borderRadius: "12px", padding: "8px",
              background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "inline-block", maxWidth: "100%"
            }}>
              <img src={certImg} alt="Chứng nhận" loading="lazy" style={{ display: "block", maxWidth: "100%", height: "auto", borderRadius: "8px" }} />
            </div>
          </div>
        </div>
      </section>

      {isCertOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setIsCertOpen(false)}>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsCertOpen(false)} style={{ position: "absolute", top: "-40px", right: "0", background: "none", border: "none", color: "#fff", fontSize: "36px", cursor: "pointer" }}>&times;</button>
            <img loading="lazy" src={certImg} alt="Chứng nhận" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: "4px" }} />
          </div>
        </div>
      )}
    </>
  );
}