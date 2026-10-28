import React, { useEffect } from "react";
import "./story.css";

const imgs = {
  grid1:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=70",
  grid2:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=70",
  grid3:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=70",
  craftOverlay:
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=70",
  numbersImg:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=70",
};

const Story = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
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
    <main className="story">
      {/* Hero Section */}
      <section className="storyHero">
        <img loading="lazy" className="storyHero__bg" src="https://images.meditea.vn/images/anh1.png" alt="MediTEA" />
        <div className="storyHero__overlay" />
        <div className="storyHero__content scroll-reveal">
          <div className="storyHero__box">
            <h1 className="storyHero__title">Câu chuyện của MediTEA</h1>
          </div>
        </div>
      </section>

      {/* Section 1: Intro + Grid */}
      <section className="s s--center">
        <div className="c">
          <h1 className="scriptTitle scroll-reveal">
            Câu chuyện của chúng tôi mới chỉ bắt đầu
          </h1>

          <div
            className="centerText scroll-reveal"
            style={{ transitionDelay: "0.2s" }}
          >
            <p>
              Mọi thứ bắt đầu trong một lần đứng giữa vùng cao, nơi những cây
              Shan Tuyết lặng lẽ vươn mình trong sương. Trên những tán cây ấy,
              những lá trà già vẫn ở lại, dày, đậm, và mang trong mình nhiều
              nắng gió. Người ta thường chọn lá non. Những lá già khụ thì ở lại
              trên cây. Và tôi hiểu rằng mình đã tìm thấy một nguồn tài nguyên
              đáng trân trọng. Không phải vì nó hiếm, mà vì nó chưa được nhìn
              đúng giá trị.
            </p>
          </div>

          <div className="grid3">
            <img loading="lazy"
              className="scroll-reveal-left"
              src={imgs.grid1}
              alt="MediTEA story 1"
            />
            <img loading="lazy"
              className="scroll-reveal"
              src={imgs.grid2}
              alt="MediTEA story 2"
              style={{ transitionDelay: "0.2s" }}
            />
            <img loading="lazy"
              className="scroll-reveal-right"
              src={imgs.grid3}
              alt="MediTEA story 3"
              style={{ transitionDelay: "0.4s" }}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Media Stack + Text Block */}
      <section className="s">
        <div className="wide">
          <div className="mediaStack scroll-reveal-left">
            <img loading="lazy"
              className="mediaStack__overlay"
              src={imgs.craftOverlay}
              alt="Không gian"
            />
          </div>

          <div className="textBlock scroll-reveal-right">
            <p>
              Tôi bắt đầu nghĩ về những chiếc lá đã đi qua nhiều mùa mưa nắng,
              tích tụ đủ nắng gió để trở nên đậm hơn, sâu hơn và bền hơn trong
              hương vị. Lá già không mềm mại như búp non, nhưng chính sự cứng
              cáp ấy lại giữ được cấu trúc và hậu vị lâu dài khi pha thành trà.
              Nếu được làm đúng cách, chúng không hề thô, mà mang một chiều sâu
              rất riêng — thứ cảm giác ở lại trong cổ họng và trong cả tâm trí.
            </p>

            <p>
              Từ ý nghĩ ấy, MediTEA được hình thành với mong muốn làm trọn vẹn
              giá trị của lá già cổ thụ. Trà không nhất thiết phải cầu kỳ hay xa
              rời nhịp sinh hoạt quen thuộc. Một chén trà có thể hiện diện trên
              bàn làm việc buổi sáng, trong giờ nghỉ trưa, hay khi chiều xuống
              và cần một khoảng lặng nhỏ. MediTEA không hướng đến sự phô trương,
              mà muốn làm nên một chén trà có thể đi cùng đời sống hàng ngày.
              Một loại trà đủ sâu để cảm nhận, nhưng đủ gần gũi để trở thành
              thói quen.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Numbers */}
      <section className="s s--muted">
        <div className="c numbersWrap">
          <div className="numbersCard scroll-reveal-left">
            <h2>MEDITEA QUA CÁC CON SỐ</h2>
            <div className="divider" />
            <ul>
              <li>
                <b>01</b> Chọn lá già cổ thụ – hậu vị dài
              </li>
              <li>
                <b>03</b> Tiêu chí: sạch – sâu – bền
              </li>
              <li>
                <b>04</b> Mùa làm trà chính mỗi năm
              </li>
              <li>
                <b>10</b> Mẻ nhỏ/đợt sao sấy để kiểm soát chuẩn
              </li>
              <li>
                <b>15</b> Quy trình thủ công theo nhịp nhiệt
              </li>
              <li>
                <b>98%</b> Tập trung nguyên bản, không phô trương
              </li>
            </ul>
          </div>

          <div className="numbersRight scroll-reveal-right">
            <div className="numbersText">
              <p>
                <b>Tên gọi MediTEA</b> là sự kết hợp giữa Meditation và Tea. Trà
                không chỉ là thức uống mà còn là một hình thức điều chỉnh nhịp
                sống, thư thái và bình an.
              </p>
              <p>
                Mỗi mẻ trà của MediTEA được sao sấy thủ công trong không gian
                gần gũi thiên nhiên, nơi ánh sáng, cây xanh và không khí thoáng
                đãng trở thành một phần của quá trình chế biến. Không dây chuyền
                công nghiệp khép kín, không sản xuất đại trà, mỗi mẻ trà được
                làm trong quy mô nhỏ để kiểm soát nhiệt độ và thời gian một cách
                cẩn trọng. Khi hương bắt đầu dậy lên và màu lá chuyển đúng độ,
                tôi biết mình đang giữ được bản tính nguyên bản mà thiên nhiên
                đã trao cho nó.
              </p>
            </div>
            <img loading="lazy" className="numbersImg" src={imgs.numbersImg} alt="Cảnh núi" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Story;
