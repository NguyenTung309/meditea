import React, { useState, useEffect } from "react";
import "./media.css";
import { listGalleryImages } from "../../config/GalleryRequest";

const TABS = [
  "Tất Cả",
  "Sản phẩm",
  "Vùng trà",
  "Xưởng trà",
  "Quy trình",
  "Khoảnh khắc"
];

// Dynamically generate image data array
const IMAGES = [
  // Vùng trà: Vt1 - Vt5 (Vt6 không tồn tại trên R2)
  ...Array.from({ length: 5 }, (_, i) => ({ id: `vt${i+1}`, src: `https://images.meditea.vn/images/Vt${i+1}.webp`, category: "Vùng trà" })),
  // Xưởng trà: Xt1 - Xt2 (Xt3 không tồn tại trên R2)
  ...Array.from({ length: 2 }, (_, i) => ({ id: `xt${i+1}`, src: `https://images.meditea.vn/images/Xt${i+1}.webp`, category: "Xưởng trà" })),
  // Quy trình: Qt1 - Qt5
  ...Array.from({ length: 5 }, (_, i) => ({ id: `qt${i+1}`, src: `https://images.meditea.vn/images/Qt${i+1}.webp`, category: "Quy trình" })),
  // Khoảnh khắc: Kk1 - Kk4
  ...Array.from({ length: 4 }, (_, i) => ({ id: `kk${i+1}`, src: `https://images.meditea.vn/images/Kk${i+1}.webp`, category: "Khoảnh khắc" }))
];

const Media = () => {
  const [activeTab, setActiveTab] = useState("Tất Cả");
  const [selectedImage, setSelectedImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const [galleryImages, setGalleryImages] = useState([]);

  const allImages = [...IMAGES, ...galleryImages.map(i => ({ id: i._id, src: i.imageUrl, category: i.category }))];
  const filteredImages = activeTab === "Tất Cả" 
    ? allImages 
    : allImages.filter(img => img.category === activeTab);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  // Fetch gallery images from admin
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await listGalleryImages();
        setGalleryImages(res?.metadata || []);
      } catch { setGalleryImages([]); }
    };
    fetchGallery();
  }, []);

  // Responsive resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") handleNext(e);
      if (e.key === "ArrowLeft") handlePrev(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, filteredImages]);

  const curIdx = selectedImage ? filteredImages.findIndex(img => img.id === selectedImage.id) : -1;

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (curIdx < filteredImages.length - 1) setSelectedImage(filteredImages[curIdx + 1]);
    else setSelectedImage(filteredImages[0]);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (curIdx > 0) setSelectedImage(filteredImages[curIdx - 1]);
    else setSelectedImage(filteredImages[filteredImages.length - 1]);
  };

  return (
    <main className="media-page">
      {/* HERO SECTION */}
      <section className="media__hero">
        <div className="media__overlay" />
        <div className="media__hero-inner scroll-reveal">
          <h1 className="media__title">Tư liệu truyền thông</h1>
          <p className="media__desc">
            Chào mừng bạn đến với Tư liệu Truyền thông của MediTea. Tại đây, bạn có thể tìm thấy các hình ảnh, ấn phẩm và video về MediTea.
          </p>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="media__gallery-section">
        <div className="media__container">
          
          <div className="media__gallery-header scroll-reveal">
            <h2 className="media__gallery-title">Ảnh</h2>
          </div>

          {isMobile ? (
            <div className="media__dropdown-wrapper">
              <button className="media__dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {activeTab}
                <span className="media__dropdown-arrow">&#9660;</span>
              </button>
              {dropdownOpen && (
                <div className="media__dropdown-menu">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      className={`media__dropdown-item ${activeTab === tab ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab(tab);
                        setSelectedImage(null);
                        setDropdownOpen(false);
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="media__tabs scroll-reveal">
              {TABS.map((tab, idx) => (
                <React.Fragment key={tab}>
                  <button
                    className={`media__tab-btn ${activeTab === tab ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedImage(null);
                    }}
                  >
                    {tab}
                  </button>
                  {idx < TABS.length - 1 && <span className="media__tab-divider">|</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="media__grid">
            {filteredImages.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className="media__grid-item scroll-reveal"
                style={{ transitionDelay: `${Math.min(index * 0.06, 0.36)}s` }}
                onClick={() => setSelectedImage(img)}
              >
                <div className="media__img-wrapper">
                  <img src={img.src} alt={img.category} className="media__img" loading="lazy"
                    width="400" height="300" decoding="async"
                    onLoad={(e) => {
                      e.target.classList.add("loaded");
                      e.target.parentElement.style.animation = "none";
                      e.target.parentElement.style.background = "transparent";
                    }} />
                  <div className="media__img-overlay-hover">
                    <span className="media__img-category">{img.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="media__lightbox" onClick={() => setSelectedImage(null)}>
          <button className="media__lightbox-arrow media__lightbox-arrow--prev" onClick={handlePrev}>
            ‹
          </button>
          <div className="media__lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="media__lightbox-close" 
              onClick={() => setSelectedImage(null)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <img loading="lazy" src={selectedImage.src} alt={selectedImage.category} className="media__lightbox-img" />
          </div>
          <button className="media__lightbox-arrow media__lightbox-arrow--next" onClick={handleNext}>
            ›
          </button>
        </div>
      )}
    </main>
  );
};

export default Media;
