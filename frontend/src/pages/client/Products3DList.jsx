import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODELS_3D } from "../../data/models3d";

export default function Products3DList() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .gallery-page {
          min-height: 100vh;
          background: #0c0c14;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }

        /* ── Hero ── */
        .gallery-hero {
          position: relative;
          padding: 60px 6% 70px;
          text-align: center;
          background: linear-gradient(180deg, #13132a 0%, #0c0c14 100%);
          overflow: hidden;
        }
        .gallery-hero::before {
          content: '';
          position: absolute;
          top: -120px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(192,160,98,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .gallery-back {
          position: absolute; top: 28px; left: 6%;
          background: none; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); padding: 8px 18px;
          border-radius: 8px; cursor: pointer; font-size: 14px;
          font-family: 'Inter', sans-serif; font-weight: 500;
          transition: all 0.25s ease;
          display: flex; align-items: center; gap: 6px;
        }
        .gallery-back:hover {
          border-color: rgba(192,160,98,0.6);
          color: #c0a062;
          background: rgba(192,160,98,0.08);
        }
        .gallery-badge {
          display: inline-block;
          background: rgba(192,160,98,0.15);
          color: #c0a062;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .gallery-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 14px 0;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #ffffff 0%, #c0a062 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gallery-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 1.05rem;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── Grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
          padding: 0 6% 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Card ── */
        .gallery-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
          animation: cardIn 0.6s ease-out forwards;
        }
        .gallery-card:hover {
          transform: translateY(-6px);
          border-color: rgba(192,160,98,0.3);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(192,160,98,0.15);
          background: rgba(255,255,255,0.06);
        }
        .gallery-card:hover .card-img {
          transform: scale(1.06);
        }
        .gallery-card:hover .card-badge-360 {
          background: #c0a062;
          color: #0c0c14;
        }

        /* ── Card Image ── */
        .card-img-wrapper {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #16162a;
        }
        .card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .card-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.15); font-size: 56px;
        }
        .card-badge-360 {
          position: absolute;
          top: 14px; right: 14px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          color: #c0a062;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        /* ── Card Body ── */
        .card-body {
          padding: 22px 24px 26px;
        }
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #f0ece4;
        }
        .card-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Animation ── */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Empty ── */
        .gallery-empty {
          text-align: center;
          padding: 80px 20px;
          color: rgba(255,255,255,0.3);
          font-size: 1rem;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .gallery-hero { padding: 50px 5% 50px; }
          .gallery-title { font-size: 2rem; }
          .gallery-grid { grid-template-columns: 1fr; padding: 0 5% 60px; gap: 20px; }
          .gallery-back { top: 16px; left: 5%; padding: 6px 14px; font-size: 13px; }
        }
      `}</style>

      <div className="gallery-page">
        {/* ── Hero ── */}
        <div className="gallery-hero">
          <button className="gallery-back" onClick={() => navigate("/")}>
            ← Trang chủ
          </button>

          <div className="gallery-badge">✦ MediTea Collection</div>
          <h1 className="gallery-title">Không gian 3D</h1>
          <p className="gallery-subtitle">
            Khám phá bộ sưu tập sản phẩm dưới góc nhìn 360° tương tác. Click vào
            sản phẩm để trải nghiệm chi tiết.
          </p>
        </div>

        {/* ── Grid ── */}
        {MODELS_3D.length > 0 ? (
          <div className="gallery-grid">
            {MODELS_3D.map((model, i) => (
              <div
                className="gallery-card"
                key={model.id}
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => navigate(`/3d-products/${model.id}`)}
              >
                <div className="card-img-wrapper">
                  {model.image ? (
                    <img loading="lazy"
                      className="card-img"
                      src={model.image}
                      alt={model.title}
                    />
                  ) : (
                    <div className="card-img-placeholder">◇</div>
                  )}
                  <span className="card-badge-360">360°</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{model.title}</h3>
                  <p className="card-desc">{model.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">Đang cập nhật thêm sản phẩm 3D...</div>
        )}
      </div>
    </>
  );
}
