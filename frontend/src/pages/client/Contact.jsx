import React, { useEffect } from "react";
import "./contact.css";

const Contact = () => {
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

    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-up, .scroll-reveal-delay"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="contact-page">
      {/* HERO SECTION */}
      <section className="contact__hero">
        <div className="contact__overlay" />
        <div className="contact__hero-inner scroll-reveal">
          <h1 className="contact__title">Liên Hệ Với Chúng Tôi</h1>
          <p className="contact__desc">
            Nếu bạn có bất kỳ yêu cầu nào cần trợ giúp, vui lòng liên hệ với chúng tôi.
          </p>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="contact__info-section">
        <div className="contact__info-container">
          {/* Phone */}
          <div className="contact__info-item scroll-reveal-up" style={{ transitionDelay: '0s' }}>
            <div className="contact__info-icon">
              {/* Phone SVG */}
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div className="contact__info-content">
              <span>0963118860</span>
            </div>
          </div>

          <div className="contact__info-divider"></div>

          {/* Location */}
          <div className="contact__info-item scroll-reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div className="contact__info-icon">
              {/* Map Pin SVG */}
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="contact__info-content">
              <span>Thôn 6 - xã Yên Xuân - Hà Nội - Việt Nam</span>
            </div>
          </div>

          <div className="contact__info-divider"></div>

          {/* Email */}
          <div className="contact__info-item scroll-reveal-up" style={{ transitionDelay: '0.4s' }}>
            <div className="contact__info-icon">
              {/* Email SVG */}
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className="contact__info-content">
              <span>medihomeretreat@gmail.com</span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Contact;
