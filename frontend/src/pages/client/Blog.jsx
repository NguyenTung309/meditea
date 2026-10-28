import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./blog.css";

const TABS = [
  "Tất Cả", 
  "Câu Chuyện MediTEA", 
  "Văn Hóa Trà Việt", 
  "Trải Nghiệm & Du Lịch", 
  "Lối Sống Chậm"
];

const Blog = () => {
  const [activeTab, setActiveTab] = useState("Tất Cả");

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

    const elements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  return (
    <main className="blog-page">
      {/* HEADER SECTION */}
      <section className="blog__header">
        <h1 className="blog__title scroll-reveal">Blog</h1>
        
        <div className="blog__tabs scroll-reveal">
          {TABS.map((tab, idx) => (
            <React.Fragment key={tab}>
              <button 
                className={`blog__tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
              {idx < TABS.length - 1 && <span className="blog__tab-divider">|</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* LATEST POST (FEATURED) */}
      <section className="blog__featured-section">
        <div className="blog__container">
          <div className="blog__featured-card">
            <div className="blog__featured-text scroll-reveal-left">
              <h2 className="blog__featured-title">
                Văn Hóa Trà Việt Nam – Nghệ Thuật Thưởng Trà Của Người Việt
              </h2>
              <div className="blog__meta">27/03/2026</div>
              <p className="blog__featured-desc">
                Không cầu kỳ như trà đạo Nhật, không nghi thức như Trung Hoa, trà Việt giản dị – nhưng đủ sâu để giữ người ta ngồi lại.
              </p>
              <Link to="/blog/van-hoa-tra-viet-nam" className="blog__read-more">Xem thêm</Link>
            </div>
            <div className="blog__featured-media scroll-reveal-right">
              <img loading="lazy" src="/images/blog-1.jpg" alt="Văn Hóa Trà Việt Nam" className="blog__featured-img" />
            </div>
          </div>
        </div>
      </section>

      {/* OLDER POSTS */}
      <section className="blog__older-section">
        <div className="blog__container">
          <div className="blog__grid">
            
            {/* Older Post 1 */}
            <article className="blog__card scroll-reveal-up">
              <div className="blog__card-media">
                <img loading="lazy" src="/images/tra-bancha.webp" alt="Trà Bancha" className="blog__card-img" />
              </div>
              <div className="blog__card-content">
                <h3 className="blog__card-title">Trà Bancha – Tác Dụng Tuyệt Vời Của Lá Trà Già</h3>
                <div className="blog__meta">27/03/2026</div>
                <p className="blog__card-excerpt">
                  Không phải lá non, trà lá già mang một sự “êm” rất riêng – phù hợp với những người muốn chăm sóc sức khỏe một cách nhẹ nhàng.
                </p>
                <Link to="/blog/tra-bancha" className="blog__read-more" style={{ marginTop: '16px', display: 'inline-block' }}>Xem thêm</Link>
              </div>
            </article>

            {/* Empty space or a second older post if needed to balance grid, but user said 'chỉ có 2 bài viết', so leaving empty box or just having one card */}
            
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
