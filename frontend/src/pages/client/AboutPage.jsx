import React, { useEffect } from "react";
import "../../App.css";
import { useScrollReveal } from "../../components/Homepage";

export default function AboutPage() {
  useScrollReveal();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* ===== HERO SECTION ===== */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <img loading="lazy" src="/images/số 1.jpg" alt="Đồi chè MediTea" />
          <div className="about-hero__overlay"></div>
        </div>
        <div className="about-hero__content scroll-reveal">
          <h1 className="about-hero__title">Câu chuyện của MediTea</h1>
          <p className="about-hero__subtitle">
            Khơi nguồn từ những lá trà già trên vùng núi cao, mang trong mình
            nắng gió và thời gian.
          </p>
        </div>
      </section>

      {/* ===== STORY CONTENT ===== */}
      <section className="about-content">
        <div className="about-content__container">
          {/* Block 1: The Beginning */}
          <div className="about-block">
            <div className="about-block__text scroll-reveal-left">
              <h2 className="about-block__heading">Khởi nguồn</h2>
              <p>
                Mọi thứ bắt đầu trong một lần đứng giữa vùng cao, nơi những cây
                Shan Tuyết lặng lẽ vươn mình trong sương. Trên những tán cây ấy,
                những lá trà già vẫn ở lại, dày, đậm, và mang trong mình nhiều
                nắng gió.
              </p>
              <p>
                Người ta thường chọn lá non. Những lá già khụ thì ở lại trên
                cây. Và tôi hiểu rằng mình đã tìm thấy một nguồn tài nguyên đáng
                trân trọng. Không phải vì nó hiếm, mà vì nó chưa được nhìn đúng
                giá trị.
              </p>
            </div>
            <div className="about-block__img scroll-reveal-right">
              <img loading="lazy"
                src="https://images.meditea.vn/images/anh3.png"
                alt="Cây trà Shan Tuyết trong sương"
              />
            </div>
          </div>

          {/* Block 2: The Old Leaves */}
          <div className="about-block about-block--reverse">
            <div className="about-block__text scroll-reveal-right">
              <h2 className="about-block__heading">Giá trị của lá già</h2>
              <p>
                Tôi bắt đầu nghĩ về những chiếc lá đã đi qua nhiều mùa mưa nắng,
                tích tụ đủ nắng gió để trở nên đậm hơn, sâu hơn và bền hơn trong
                hương vị. Lá già không mềm mại như búp non, nhưng chính sự cứng
                cáp ấy lại giữ được cấu trúc và hậu vị lâu dài khi pha thành
                trà.
              </p>
              <p>
                Nếu được làm đúng cách, chúng không hề thô, mà mang một chiều
                sâu rất riêng — thứ cảm giác ở lại trong cổ họng và trong cả tâm
                trí.
              </p>
            </div>
            <div className="about-block__img scroll-reveal-left">
              <img loading="lazy" src="/images/số 2.jpg" alt="Lá trà già MediTea" />
            </div>
          </div>

          {/* Block 3: The Philosophy */}
          <div className="about-block">
            <div className="about-block__text scroll-reveal-left">
              <h2 className="about-block__heading">
                Đời sống tềnh toàng, ly trà đậm sâu
              </h2>
              <p>
                Từ ý nghĩ ấy, MediTea được hình thành với mong muốn làm trọn vẹn
                giá trị của lá già cổ thụ. Trà không nhất thiết phải cầu kỳ hay
                xa rời nhịp sinh hoạt quen thuộc. Một chén trà có thể hiện diện
                trên bàn làm việc buổi sáng, trong giờ nghỉ trưa, hay khi chiều
                xuống và cần một khoảng lặng nhỏ.
              </p>
              <p>
                MediTea không hướng đến sự phô trương, mà muốn làm nên một chén
                trà có thể đi cùng đời sống hàng ngày. Một loại trà đủ sâu để
                cảm nhận, nhưng đủ gần gũi để trở thành thói quen.
              </p>
              <div className="about-quote">
                <span className="about-quote__mark">"</span>
                Tên gọi MediTea là sự kết hợp giữa <strong>
                  Meditation
                </strong>{" "}
                và <strong>Tea</strong>. Trà không chỉ là thức uống mà còn là
                một hình thức điều chỉnh nhịp sống, thư thái và bình an.
                <span className="about-quote__mark">"</span>
              </div>
            </div>
            <div className="about-block__img about-block__img--tall scroll-reveal-right">
              <img loading="lazy" src="/images/số 3.jpg" alt="Sản phẩm trà MediTea" />
            </div>
          </div>

          {/* Block 4: The Craft */}
          <div className="about-block about-block--reverse">
            <div className="about-block__text scroll-reveal-right">
              <h2 className="about-block__heading">Chế tác thủ công</h2>
              <p>
                Mỗi mẻ trà của MediTea được sao sấy thủ công trong không gian
                gần gũi thiên nhiên, nơi ánh sáng, cây xanh và không khí thoáng
                đãng trở thành một phần của quá trình chế biến. Không dây chuyền
                công nghiệp khép kín, không sản xuất đại trà.
              </p>
              <p>
                Mỗi mẻ được làm trong quy mô nhỏ để kiểm soát nhiệt độ và thời
                gian một cách cẩn trọng. Khi hương bắt đầu dậy lên và màu lá
                chuyển đúng độ, tôi biết mình đang giữ được bản tính nguyên bản
                mà thiên nhiên đã trao cho nó.
              </p>
            </div>
            <div className="about-block__img scroll-reveal-left">
              <img loading="lazy" src="/images/số 4.jpg" alt="Quá trình sao sấy thủ công" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
