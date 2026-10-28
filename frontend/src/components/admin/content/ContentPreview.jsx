import React from "react";

const SCALE = 0.33;
const W = 1200;

function Scaled({ h, children }) {
  return (
    <div style={{ width: "100%", height: Math.round(h * SCALE), position: "relative", overflow: "hidden", borderRadius: 8 }}>
      <div style={{ position: "absolute", width: W, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

function Img({ src, style }) {
  if (!src) return <div style={{ background: "#e0dbd4", borderRadius: 6, ...style }} />;
  return (
    <img src={src} alt="" style={{ objectFit: "cover", borderRadius: 6, display: "block", ...style }}
      onError={(e) => { e.target.style.background = "#e0dbd4"; e.target.style.opacity = 0; }} />
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────── */
function HeroPreview({ v }) {
  const src = v.image;
  const isVideo = src && (src.endsWith(".mp4") || src.endsWith(".webm"));
  return (
    <Scaled h={740}>
      <div style={{ width: W, height: 740, position: "relative", background: "#1a2b12", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isVideo ? (
          <video src={src} muted loop autoPlay playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65 }} />
        ) : src ? (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55 }} />
        ) : null}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", color: "#fff", padding: "0 80px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 90, fontWeight: 900, margin: "0 0 20px", letterSpacing: 6, textTransform: "uppercase" }}>
            {v.title || "MediTEA"}
          </h1>
          <p style={{ fontSize: 26, fontStyle: "italic", opacity: 0.88, margin: 0, fontFamily: "Georgia, serif" }}>
            {v.text || "Lắng nghe hồn trà Việt"}
          </p>
        </div>
      </div>
    </Scaled>
  );
}

/* ─── STORY ─────────────────────────────────────────────────────────── */
function StoryPreview({ v }) {
  const img1 = v.image  || "https://images.meditea.vn/images/tea_leaves.png";
  const img2 = v.image2 || "https://images.meditea.vn/images/anh3.png";
  const img3 = v.image3 || "https://images.meditea.vn/images/tea_plantation.png";
  return (
    <Scaled h={700}>
      <div style={{ width: W, background: "#fff" }}>
        {/* Quote bar */}
        <div style={{ padding: "48px 100px 32px", textAlign: "center", borderBottom: "1px solid #f0ebe3" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 28, fontStyle: "italic", color: "#3a2a1a", margin: 0 }}>
            " Trà ngon không đến từ sự vội vàng, mà đến từ thời gian và sự kiên nhẫn. "
          </p>
          <p style={{ fontSize: 13, letterSpacing: 4, color: "#aaa", marginTop: 14, textTransform: "uppercase" }}>—— MEDITEA</p>
        </div>
        {/* Grid: text left + 3 images right */}
        <div style={{ display: "flex", gap: 60, padding: "60px 100px", alignItems: "center" }}>
          {/* Left text */}
          <div style={{ flex: "0 0 380px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 800, color: "#2a1a0e", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 1 }}>
              {v.title || "CÂU CHUYỆN MEDITEA"}
            </h2>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.85, margin: "0 0 28px" }}>
              {v.text || ""}
            </p>
            <div style={{ display: "inline-block", border: "1px solid #2a1a0e", padding: "12px 28px", fontSize: 13, letterSpacing: 2, color: "#2a1a0e" }}>
              TÌM HIỂU THÊM
            </div>
          </div>
          {/* Right: 3-image collage */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.3fr 1fr", gridTemplateRows: "260px 200px", gap: 10, minHeight: 470 }}>
            <Img src={img1} style={{ width: "100%", height: "100%", gridColumn: 1, gridRow: 1 }} />
            <Img src={img2} style={{ width: "100%", height: "100%", gridColumn: 2, gridRow: "1 / 3" }} />
            <Img src={img3} style={{ width: "100%", height: "100%", gridColumn: 1, gridRow: 2 }} />
          </div>
        </div>
      </div>
    </Scaled>
  );
}

/* ─── VALUES (6 feature cards) ──────────────────────────────────────── */
function ValuesPreview({ v }) {
  const steps = v.steps?.length === 6 ? v.steps : Array(6).fill({});
  return (
    <Scaled h={660}>
      <div style={{ width: W, padding: "80px 100px", background: "#fbf9f4" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 800, color: "#2a1a0e", margin: "0 0 14px", textTransform: "uppercase" }}>
            {v.title || "GIÁ TRỊ NGUYÊN BẢN"}
          </h2>
          <p style={{ fontSize: 17, color: "#777", maxWidth: 640, margin: "0 auto" }}>{v.text || ""}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "28px 22px", border: "1px solid #ede8e0" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{s.icon || "🌿"}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2a1a0e", margin: "0 0 10px" }}>{s.title || `Bước ${i + 1}`}</h3>
              <p style={{ fontSize: 14, color: "#888", margin: 0, lineHeight: 1.65 }}>{s.desc || ""}</p>
            </div>
          ))}
        </div>
      </div>
    </Scaled>
  );
}

/* ─── CORE VALUES (Lá trà già nguyên bản) ──────────────────────────── */
function TeaCollectionPreview({ v }) {
  const steps = v.steps?.length === 3 ? v.steps : [{}, {}, {}];
  const images = [v.image, v.image2, v.image3];
  return (
    <Scaled h={600}>
      <div style={{ width: W, padding: "80px 100px", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 800, color: "#2a1a0e", margin: "0 0 14px", textTransform: "uppercase" }}>
            {v.title || "Bo Luu Tap Tra"}
          </h2>
          <p style={{ fontSize: 16, color: "#777", maxWidth: 640, margin: "0 auto" }}>{v.text || ""}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <Img src={images[i] || s.img} style={{ width: "100%", height: 320, borderRadius: 10, objectFit: "cover" }} />
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#2a1a0e", margin: "14px 0 6px" }}>{s.title || "San pham " + (i+1)}</h3>
              <p style={{ fontSize: 13, color: "#999", margin: 0 }}>{s.desc || ""}</p>
            </div>
          ))}
        </div>
      </div>
    </Scaled>
  );
}

function CoreValuesPreview({ v }) {
  const items = v.items?.length === 4 ? v.items : Array(4).fill({});
  return (
    <Scaled h={580}>
      <div style={{ width: W, padding: "80px 100px", background: "#fff", display: "flex", gap: 80, alignItems: "center" }}>
        {/* Left: title + text + numbered grid */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 800, color: "#2a1a0e", margin: "0 0 18px", textTransform: "uppercase" }}>
            {v.title || "MEDITEA – LÁ TRÀ GIÀ NGUYÊN BẢN"}
          </h2>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, margin: "0 0 36px" }}>{v.text || ""}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {items.map((it, i) => (
              <div key={i} style={{ borderLeft: "3px solid #5a8a2e", paddingLeft: 18 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: "#5a8a2e", display: "block", lineHeight: 1 }}>
                  {it.num || String(i + 1)}
                </span>
                <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0", lineHeight: 1.5 }}>
                  {it.text || `Mục ${i + 1}`}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Right: 2 images stacked */}
        <div style={{ flex: "0 0 340px", display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
          <Img src={v.image2} style={{ width: "65%", height: 180, borderRadius: 10 }} />
          <Img src={v.image}  style={{ width: "100%", height: 280, borderRadius: 10 }} />
        </div>
      </div>
    </Scaled>
  );
}

/* ─── EXPERIENCE / GENERIC IMAGE+TEXT ───────────────────────────────── */
function ImageTextPreview({ v, label }) {
  return (
    <Scaled h={440}>
      <div style={{ width: W, padding: "70px 100px", background: "#fff", display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, letterSpacing: 4, color: "#aaa", textTransform: "uppercase", margin: "0 0 14px" }}>{label}</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 800, color: "#2a1a0e", margin: "0 0 18px" }}>
            {v.title || <em style={{ opacity: 0.3 }}>Tiêu đề</em>}
          </h2>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, margin: 0 }}>{v.text || ""}</p>
        </div>
        {v.image && (
          <div style={{ flex: "0 0 380px" }}>
            <Img src={v.image} style={{ width: "100%", height: 300 }} />
          </div>
        )}
      </div>
    </Scaled>
  );
}

/* ─── COMMITMENT (Chứng nhận) ───────────────────────────────────────── */
function CommitmentPreview({ v }) {
  return (
    <Scaled h={460}>
      <div style={{ width: W, padding: "70px 100px", background: "#f9f6f0", display: "flex", gap: 80, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 800, color: "#2a1a0e", margin: "0 0 18px", textTransform: "uppercase" }}>
            {v.title || "CHỨNG NHẬN CHẤT LƯỢNG"}
          </h2>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, margin: 0 }}>{v.text || ""}</p>
        </div>
        {v.image && (
          <div style={{ flex: "0 0 280px", textAlign: "center" }}>
            <div style={{ border: "4px solid #957159", borderRadius: 12, padding: 8, background: "#fff", display: "inline-block", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
              <Img src={v.image} style={{ width: 260, maxHeight: 300 }} />
            </div>
          </div>
        )}
      </div>
    </Scaled>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────── */
function FooterPreview({ v }) {
  const socialMap = Object.fromEntries((v.items || []).map(i => [i.num, i.text]));
  const navLinks = v.steps || [];
  const socials = ["facebook", "instagram", "youtube", "zalo"];
  return (
    <Scaled h={360}>
      <div style={{ width: W, background: "#2a3b22", color: "#d4c8bc", fontFamily: "sans-serif" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "36px 80px 28px", borderBottom: "1px solid #3a4b32" }}>
          {/* Logo */}
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f5f0eb", letterSpacing: 3 }}>MediTEA</div>
          {/* Nav */}
          <div style={{ display: "flex", gap: 28 }}>
            {navLinks.slice(0, 5).map((l, i) => (
              <span key={i} style={{ fontSize: 14, color: "#aed98a" }}>{l.title}</span>
            ))}
          </div>
          {/* Email input */}
          <div style={{ display: "flex", border: "1px solid #5a6b52", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ background: "#1e2e18", padding: "10px 18px", fontSize: 14, color: "#888" }}>Your email</div>
            <div style={{ background: "#3a4b32", padding: "10px 16px", fontSize: 16, color: "#aed98a" }}>→</div>
          </div>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 16 }}>
            {socials.map(s => (
              <div key={s} style={{ width: 28, height: 28, borderRadius: 4, background: "#3a4b32", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#aed98a" }}>
                {s[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 80px", fontSize: 13 }}>
          <div>
            <p style={{ margin: "0 0 6px" }}>@ 2026 MediTEA</p>
            <p style={{ margin: "0 0 4px", opacity: 0.7 }}>{v.address || "Địa chỉ công ty"}</p>
            <p style={{ margin: 0, opacity: 0.7 }}>{v.contact_email || "Email"}  ·  {v.phone || "SĐT"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#fff" }}>{v.business_name || "Tên công ty"}</p>
            <p style={{ margin: "0 0 4px", opacity: 0.7 }}>Số ĐKKD: {v.business_reg || "—"}</p>
            <p style={{ margin: "0 0 4px", opacity: 0.7 }}>Đăng ký lần đầu: {v.reg_date || "—"}</p>
            <p style={{ margin: 0, opacity: 0.7 }}>Nơi cấp: {v.reg_place || "—"}</p>
          </div>
        </div>
      </div>
    </Scaled>
  );
}

/* ─── EXPORT ─────────────────────────────────────────────────────────── */
export default function ContentPreview({ sectionKey, values }) {
  const v = values || {};
  if (sectionKey === "hero")        return <HeroPreview v={v} />;
  if (sectionKey === "story")       return <StoryPreview v={v} />;
  if (sectionKey === "values")      return <ValuesPreview v={v} />;
  if (sectionKey === "tea_collection") return <TeaCollectionPreview v={v} />;
  if (sectionKey === "core_values") return <CoreValuesPreview v={v} />;
  if (sectionKey === "commitment")  return <CommitmentPreview v={v} />;
  if (sectionKey === "footer")      return <FooterPreview v={v} />;

  const labels = {
    experience: "TRẢI NGHIỆM",
  };
  return <ImageTextPreview v={v} label={labels[sectionKey] || sectionKey.toUpperCase()} />;
}
