import "../../App.css";
import { useContent } from "../hooks/useContent";

export default function About() {
  const { content } = useContent("story");

  const title = content?.title || "CÂU CHUYỆN MEDITEA";
  const text = content?.text || "Khi bắt đầu hành trình với trà, những người sáng lập MediTea không hề nghĩ mình sẽ xây dựng một thương hiệu. Họ chỉ có một suy nghĩ đơn giản: Lá trà già trên núi cao đáng được tôn trọng, giữ nguyên bản tính và chia sẻ đến những người yêu trà đích thực.";
  const img  = content?.image  || "https://images.meditea.vn/images/tea_leaves.png";
  const img2 = content?.image2 || "https://images.meditea.vn/images/anh3.png";
  const img3 = content?.image3 || "https://images.meditea.vn/images/tea_plantation.png";

  return (
    <section className="story" id="about-section">
      <div className="story__quote scroll-reveal">
        <span className="story__quote-mark">"</span>
        <blockquote className="story__blockquote">
          Trà ngon không đến từ sự vội vàng,
          <br />
          mà đến từ thời gian và sự kiên nhẫn.
        </blockquote>
        <span className="story__quote-mark story__quote-mark--end">"</span>
        <p className="story__quote-author">—— MEDITEA</p>
      </div>

      <div className="story__grid">
        <div className="story__text scroll-reveal-zoom" style={{ transitionDelay: "0.1s" }}>
          <h2 className="story__heading">{title}</h2>
          <p className="story__paragraph">{text}</p>
          <a href="/about" className="story__link">TÌM HIỂU THÊM</a>
        </div>

        <div className="story__images">
          <div className="story__img story__img--top scroll-reveal-left" style={{ transitionDelay: "0.2s" }}>
            <img src={img} alt="Tea leaves close-up" loading="lazy" />
          </div>
          <div className="story__img story__img--right scroll-reveal-flip" style={{ transitionDelay: "0.4s" }}>
            <img src={img2} alt="Tea plantation" loading="lazy" />
          </div>
          <div className="story__img story__img--bottom scroll-reveal-zoom" style={{ transitionDelay: "0.6s" }}>
            <img src={img3} alt="Misty tea hills" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}