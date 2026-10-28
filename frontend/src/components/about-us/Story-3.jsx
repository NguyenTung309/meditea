import React, { useEffect } from "react";
import "./philosophy.css";

const items = [
  {
    no: "01",
    title: "Lá trà đủ tuổi",
    img: "/images/số 5.jpg",
    desc: "MediTea chọn những lá trà đã ở lại trên cây đủ năm, trải qua nhiều mùa nắng gió để phát triển cấu trúc dày và ổn định. Lá đủ tuổi mang lại vị đậm hơn, hậu ngọt sâu hơn và cảm giác bền hơn khi thưởng thức. Việc lựa chọn này không nhằm tạo ra sự khác biệt bề nổi, mà để khai thác trọn vẹn giá trị tự nhiên vốn có của cây trà.",
  },
  {
    no: "02",
    title: "Chế biến thủ công",
    img: "/images/số 6.jpg",
    desc: "Chúng tôi sao sấy trà trong từng mẻ nhỏ, kiểm soát nhiệt và thời gian bằng sự tập trung và kinh nghiệm. Quy trình thủ công cho phép người làm trà quan sát sự chuyển biến của lá, điều chỉnh nhịp độ phù hợp thay vì phụ thuộc hoàn toàn vào máy móc. Làm chậm không chỉ để giữ chất lượng, mà còn để giữ sự kết nối trực tiếp giữa con người và nguyên liệu.",
  },
  {
    no: "03",
    title: "Giữ vị nguyên bản",
    img: "/images/số 7.jpg",
    desc: "MediTea không sử dụng hương liệu hay phụ gia để điều chỉnh mùi vị. Vị chát dịu ban đầu và hậu ngọt kéo dài là kết quả tự nhiên của lá trà đủ năm và cách chế biến đúng mức. Chúng tôi tin rằng hương vị thật, dù không chiều khẩu vị số đông ngay lập tức, vẫn có sức thuyết phục lâu dài.",
  },
  {
    no: "04",
    title: "Trung thực nguồn gốc",
    img: "/images/số 8.jpg",
    desc: "Mỗi sản phẩm của MediTea đều rõ ràng về vùng trồng, cách thu hái và quy trình chế biến. Sự minh bạch không chỉ là thông tin, mà là cam kết tôn trọng người thưởng trà. Khi biết rõ mình đang uống gì và từ đâu, niềm tin được xây dựng một cách tự nhiên và bền vững.",
  },
  {
    no: "05",
    title: "Gắn bó với thiên nhiên",
    img: "/images/số 9.jpg",
    desc: "Trà được sao sấy trong không gian gần gũi cây xanh và ánh sáng tự nhiên, nơi môi trường không chỉ là bối cảnh mà là một phần của quá trình. Khí hậu, độ ẩm và nhịp sống chậm của vùng ngoại ô góp phần giữ cho quá trình làm trà không bị tách rời khỏi tự nhiên. Chúng tôi tin rằng hương vị chân thật cần được hình thành trong một môi trường chân thật.",
  },
  {
    no: "06",
    title: "Bền vững dài hạn",
    img: "/images/số 10.jpg",
    desc: "MediTea theo đuổi sự phát triển ổn định thay vì tăng trưởng nhanh. Việc chọn lá đủ năm, sản xuất quy mô nhỏ và hạn chế can thiệp quá mức là những quyết định hướng đến sự lâu dài. Một thương hiệu trà có thể tồn tại bền vững khi biết tôn trọng tài nguyên, tôn trọng quy trình và giữ vững giá trị cốt lõi qua thời gian.",
  },
];

const Philosophy = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom, .scroll-reveal-flip, .scroll-reveal-blur",
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="phi">
      {/* HERO */}
      <section className="phi__hero">
        <div className="phi__overlay" />
        <div className="phi__container phi__heroInner scroll-reveal">
          <div className="phi__hero-badge">CÂU CHUYỆN CỦA CHÚNG TÔI</div>
          <h1 className="phi__title">Triết lý MediTea</h1>
          <p className="phi__lead">
            Chúng tôi tin rằng giá trị của trà không nằm ở việc làm khác đi, mà ở việc để lá đủ năm trên cây, quá trình chế biến đủ chậm và hương vị đủ thật khi đến tay người thưởng trà. MediTea không tìm cách tạo ra điều mới lạ bằng sự can thiệp, mà giữ trọn những gì thiên nhiên đã hình thành qua thời gian.
          </p>
        </div>
      </section>

      {/* 6 BLOCKS */}
      <section className="phi__section">
        <div className="phi__container">
          {items.map((it, idx) => {
            const reverse = (idx + 1) % 2 === 0;
            const textAnimClass = reverse
              ? "scroll-reveal-left"
              : "scroll-reveal-right";
            const mediaAnimClass = reverse
              ? "scroll-reveal-right"
              : "scroll-reveal-left";

            return (
              <article
                key={it.no}
                className={`phi__block ${reverse ? "phi__block--reverse" : ""}`}
              >
                <div className={`phi__media ${mediaAnimClass}`}>
                  <div className="phi__img-wrapper">
                    <img loading="lazy" className="phi__img" src={it.img} alt={it.title} />
                    <div className="phi__img-overlay"></div>
                  </div>
                </div>

                <div className={`phi__text ${textAnimClass}`}>
                  <div className="phi__content-card">
                    <div className="phi__head">
                      <div className="phi__no">{it.no}</div>
                      <h2 className="phi__h2">{it.title}</h2>
                    </div>
                    <div className="phi__divider"></div>
                    <p className="phi__desc">{it.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CLOSING BAR */}
      <section className="phi__closing">
        <div className="phi__container scroll-reveal">
          <div className="phi__closingBox">
            <span className="phi__closingQuote">“</span>
            <p className="phi__closingText">
              Làm chậm để giữ đúng: đúng nguyên liệu, đúng nhịp, đúng hậu vị.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Philosophy;
