import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./blog-detail.css";

const ARTICLES = {
  "van-hoa-tra-viet-nam": {
    title: "Văn Hóa Trà Việt Nam – Nghệ Thuật Thưởng Trà Của Người Việt",
    date: "27/03/2026",
    category: "Câu Chuyện MediTEA",
    excerpt: "Không cầu kỳ như trà đạo Nhật, không nghi thức như Trung Hoa, trà Việt giản dị – nhưng đủ sâu để giữ người ta ngồi lại.",
    content: (
      <>
        {/* Lịch sử */}
        <section className="scroll-reveal">
          <h2>Lịch sử văn hóa trà Việt Nam</h2>
          <div className="blog-detail__inline-img-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/lsvh1.png" alt="Lịch sử trà" className="blog-detail__inline-img" style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px' }} />
            <img loading="lazy" src="https://images.meditea.vn/images/lsvh2.png" alt="Văn hóa trà" className="blog-detail__inline-img" style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            Văn hóa trà Việt Nam đã có từ 4000 năm lịch sử, gắn liền với quá trời dựng nước và giữ nước. Dù trải qua nhiều biến động, nhưng phong cách uống trà của người Việt vẫn giữ được bản sắc riêng biệt, khác xa với trà đạo Nhật Bản, Trung Quốc.
          </p>
          <p>
            Trong một số giai đoạn, trà được xem là thức uống cao cấp chỉ được thường thức bởi vua chúa hoặc dùng cho các tầng lớp danh gia vọng tộc, đi kèm với những nghi thức pha và mời trà khá cầu kỳ. Tuy nhiên theo thời gian, trà dần trở nên gần gũi hơn, xuất hiện ở mọi tầng lớp xã hội, từ nông thôn đến thành thị.
          </p>
          <p>
            Chính sự chuyển mình này đã khiến trà không còn là biểu tượng của sự xa xỉ, mà trở thành một phần tự nhiên trong đời sống người Việt.
          </p>
        </section>

        {/* Đời sống */}
        <section className="scroll-reveal">
          <h2>Trà trong đời sống và phong tục người Việt</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/doisong.png" alt="Phong tục uống trà" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
            <span className="blog-detail__caption" style={{ display: 'block', marginTop: '12px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>Phong tục uống trà của người Việt vào ngày tết khi cả gia đình sum vầy bên nhau</span>
          </div>
          <p>
            Trà hiện diện trong hầu hết các hoạt động của người Việt, từ đời sống thường ngày đến những dịp quan trọng.
          </p>
          <p>
            Trong sinh hoạt hằng ngày, người Việt có thói quen pha trà vào buổi sáng, uống trà sau bữa ăn hoặc khi nghỉ ngơi. Trà không chỉ giúp giải khát mà còn mang lại cảm giác thư thái, nhẹ nhàng cho cả cơ thể và tinh thần.
          </p>
          <p>
            Trong các dịp lễ Tết, cưới hỏi hay giỗ chạp, trà là một phần không thể thiếu. Những chén trà nóng trở thành cầu nối giữa các thành viên trong gia đình và bạn bè, giúp mọi người gần gũi và gắn kết hơn.
          </p>
        </section>

        {/* Nghệ thuật */}
        <section className="scroll-reveal">
          <h2>Nghệ thuật thưởng trà của người Việt</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/nghethuattra.png" alt="Nghệ thuật thưởng trà" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            Nghệ thuật thưởng trà của người Việt không có một khuôn mẫu cố định. Từ xa xưa, việc pha và uống trà đã được xem là một nghệ thuật mang tính cảm nhận, không bị ràng buộc bởi quy tắc cứng nhắc.
          </p>
          <p>
            Khi uống trà, người ta thường đưa chén trà lên ngửi hương, sau đó nhấp từng ngụm nhỏ để cảm nhận vị chát ban đầu và hậu ngọt phía sau. Sự tinh tế không nằm ở kỹ thuật, mà nằm ở sự chậm rãi và sự tập trung khi thưởng thức.
          </p>
          <p>
            Trà có thể được uống một mình để suy ngẫm (độc ẩm), hoặc cùng bạn bè, tri kỷ để trò chuyện. Trong cả hai trường hợp, trà đều mang lại một trạng thái cân bằng và tĩnh lặng.
          </p>
        </section>

        {/* Vai trò */}
        <section className="scroll-reveal">
          <h2>Vai trò của trà trong đời sống người Việt</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/vaitro.png" alt="Vai trò của trà" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            Trà không chỉ là một thức uống mà còn là một phần của văn hóa ứng xử và lối sống người Việt. Trong mỗi gia đình, bộ ấm chén gần như luôn hiện diện như một vật quen thuộc.
          </p>
          <p>
            Việc mời trà thể hiện sự hiếu khách, sự tôn trọng và tình cảm của gia chủ đối với khách. Đồng thời, trà cũng phản ánh sự mộc mạc, bình đẳng trong văn hóa Việt – nơi mọi người, dù ở vị trí nào, đều có thể cùng ngồi lại bên một chén trà.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Ý nghĩa của văn hóa trà Việt</h2>
          <p>
            Văn hóa trà Việt không nằm ở sự cầu kỳ, mà nằm ở “cái tâm” của người pha và người thưởng trà. Một chén trà không chỉ mang hương vị, mà còn chứa đựng sự tỉ mỉ trong quá trình làm ra nó và tình cảm trong cách trao đi.
          </p>
          <p>
            Vị chát nhẹ rồi chuyển sang hậu ngọt của trà cũng giống như cách người Việt cảm nhận cuộc sống – giản dị, sâu sắc và giàu tình nghĩa.
          </p>
          <p>
            Với MediTEA, trà không phải là một trải nghiệm xa vời hay mang tính nghi thức. Trà nên là một phần tự nhiên trong đời sống – nơi ai cũng có thể dễ dàng bắt đầu.
          </p>
          <p>
            Không cần quá nhiều kiến thức, không cần chuẩn bị cầu kỳ, chỉ cần một ấm trà đơn giản và một khoảng thời gian đủ yên tĩnh, là đã có thể cảm nhận được giá trị của việc thưởng trà.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Lời kết</h2>
          <p>
            Văn hóa trà Việt đã tồn tại và phát triển qua nhiều thế hệ, trở thành một phần không thể thiếu trong đời sống và bản sắc của người Việt.
          </p>
          <p>
            Và với MediTEA, nghệ thuật thưởng trà không phải là điều xa vời, mà là một thói quen nhẹ nhàng, tiện lợi, dễ tiếp cận – hiện diện trong chính những khoảnh khắc đời thường nhất.
          </p>
        </section>
      </>
    )
  },
  "tra-bancha": {
    title: <>Trà Bancha – Tác Dụng Tuyệt Vời <br /> Của Lá Trà Già</>,
    date: "27/03/2026",
    category: "Câu Chuyện MediTEA",
    excerpt: "Không phải lá non, trà lá già mang một sự “êm” rất riêng – phù hợp với những người muốn chăm sóc sức khỏe một cách nhẹ nhàng.",
    content: (
      <>
        <section className="scroll-reveal">
          <p>
            Trà Bancha là loại trà được chế biến từ những lá trà Shan Tuyết già có độ tuổi trên 3 năm. Loại trà này nổi tiếng trong giới trà đạo Nhật Bản với mùi thơm đặc trưng và hương vị đậm đà hơn so với các loại trà khác.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Trà Bancha là gì?</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/Kk2.png" alt="Trà Bancha là gì" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            Trà Bancha là loại trà được chế biến từ những lá trà già của cây trà, thường có độ tuổi từ 3 năm trở lên. So với lá non, lá già có kích thước lớn hơn, có thể dài tới 20 cm, dày hơn và mang màu nâu đậm, vì vậy khi chế biến sẽ tạo ra một loại trà có đặc tính rất khác biệt.
          </p>
          <p>
            Khác với trà xanh hay trà đen, điểm đặc trưng của Bancha nằm ở chỗ nó giữ nguyên hình dạng lá sau khi chế biến, không bị nghiền nhỏ hay xé vụn. Điều này không chỉ giúp giữ lại cấu trúc tự nhiên của lá trà mà còn phản ánh cách tiếp cận rất “nguyên bản” – ít can thiệp, ít xử lý.
          </p>
          <p>
            Trà này thường được sử dụng trong phương pháp dưỡng sinh OHSAWA, tên gọi “Bancha” xuất phát từ “bangai-cha”, nghĩa là “trà ngoài chuẩn” hay “trà bị loại”, bởi trước đây những lá già thường không được đánh giá cao. Tuy nhiên, chính phần “bị bỏ qua” đó lại mang đến một giá trị rất khác – nhẹ hơn, ổn định hơn và phù hợp với việc sử dụng lâu dài.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Quy trình làm trà Bancha – tối giản để giữ tự nhiên</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/Qt2.png" alt="Quy trình làm trà Bancha" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            So với các dòng trà xanh cao cấp, quy trình làm Bancha không quá phức tạp nhưng lại đòi hỏi sự cẩn thận để giữ được giá trị tự nhiên của lá trà.
          </p>
          <p>
            Sau khi thu hoạch, lá trà được chọn lọc kỹ để loại bỏ những lá sâu hoặc hư hỏng. Tiếp đó, lá được phơi héo trong bóng râm thay vì phơi nắng trực tiếp, giúp lá mềm lại một cách tự nhiên mà không bị mất cấu trúc.
          </p>
          <p>
            Quá trình sao trà diễn ra sau đó nhằm định hình hương vị, nhưng không làm biến đổi quá mạnh đặc tính của lá. Một bước đáng chú ý là “hạ thổ” – công đoạn giúp trà thoát hết hơi nóng và ổn định trước khi đóng gói. Bước này không chỉ giúp bảo quản tốt hơn mà còn góp phần tăng giá trị dinh dưỡng của trà.
          </p>
          <p>
            Chính sự tối giản trong quy trình này giúp Bancha giữ được sự mộc mạc và nguyên bản – đúng với tinh thần của một loại trà dùng lâu dài.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Cách pha trà Bancha – đơn giản nhưng cần đúng</h2>
          <div className="blog-detail__inline-img-container" style={{ margin: '24px 0 32px' }}>
            <img loading="lazy" src="https://images.meditea.vn/images/patra.png" alt="Cách pha trà Bancha" className="blog-detail__inline-img" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
          <p>
            Dù là một loại trà đơn giản, Bancha vẫn cần được pha đúng cách để giữ trọn hương vị và dưỡng chất. Nhiều người có thói quen đun trà trực tiếp, nhưng với Bancha, điều này lại không phù hợp.
          </p>
          <p>
            Việc đun lâu ở nhiệt độ cao có thể làm tăng lượng caffeine không cần thiết, đồng thời làm mất đi các vitamin và hương vị tự nhiên của trà. Thay vào đó, Bancha nên được hãm như trà xanh, với nước khoảng 90–95°C trong thời gian 5–7 phút.
          </p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Bước 1:</strong> Lấy một lượng trà vừa đủ, tùy thuộc vào số người thưởng thức.</li>
            <li style={{ marginBottom: '10px' }}><strong>Bước 2:</strong> Đun nước sôi và để nguội xuống khoảng 90 – 95 độ C.</li>
            <li style={{ marginBottom: '10px' }}><strong>Bước 3:</strong> Đổ nước vào ấm chứa trà và hãm trong 5 – 7 phút.</li>
            <li><strong>Bước 4:</strong> Rót trà ra ly và thưởng thức.</li>
          </ul>
          <p>
            Cách pha này giúp giữ được sự cân bằng: không quá đậm, không quá nhạt, vừa đủ để cảm nhận được vị trà một cách nhẹ nhàng.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Tác dụng của trà Bancha đối với sức khỏe</h2>
          <p>
            Một trong những điểm khác biệt lớn nhất của Bancha so với trà xanh thông thường là tính kiềm nhẹ. Trong khi nhiều loại trà có xu hướng tạo tính axit, Bancha lại giúp trung hòa axit trong cơ thể, từ đó mang lại cảm giác dễ chịu hơn khi uống, đặc biệt là khi bụng đói.
          </p>
          <p>
            Ngoài ra, do hàm lượng caffeine thấp, Bancha không gây cảm giác “say trà” hay mất ngủ, mà ngược lại còn hỗ trợ thư giãn và cải thiện giấc ngủ. Đây là lý do vì sao loại trà này phù hợp với nhiều đối tượng, kể cả người nhạy cảm với caffeine.
          </p>
          <p>
            Các lợi ích nổi bật của Bancha có thể kể đến như: hỗ trợ thanh lọc cơ thể, cải thiện tiêu hóa, giúp làm đẹp da, hỗ trợ giảm cân nhẹ nhàng và góp phần bảo vệ cơ thể nhờ các chất chống oxy hóa. Bên cạnh đó, trà còn có tác dụng làm dịu dạ dày, hỗ trợ giảm cảm giác khó chịu sau khi uống rượu và giúp cơ thể cân bằng hơn trong sinh hoạt hàng ngày.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Vì sao Bancha phù hợp với lối sống hiện đại?</h2>
          <p>
            Trong một nhịp sống nhanh, nhiều người tìm đến những thứ mạnh – cà phê đậm, đồ uống kích thích – để duy trì năng lượng. Nhưng về lâu dài, cơ thể lại cần những thứ nhẹ hơn, ổn định hơn.
          </p>
          <p>
            Bancha phù hợp ở chính điểm đó. Không quá đậm, không gây áp lực, có thể uống nhiều lần trong ngày mà vẫn giữ được sự dễ chịu. Đây không phải là loại trà để “thử một lần”, mà là loại trà có thể trở thành thói quen.
          </p>
        </section>

        <section className="scroll-reveal">
          <h2>Kết</h2>
          <p>
            Trà Bancha cho thấy một điều rất rõ: giá trị không nằm ở sự nổi bật, mà nằm ở khả năng đồng hành lâu dài.
          </p>
          <p>
            Với MediTEA, Bancha không phải là sản phẩm để tạo ấn tượng mạnh, mà là lựa chọn dành cho sự bền vững.
          </p>
          <p>
            Một loại trà đủ nhẹ để uống mỗi ngày, đủ êm để không làm cơ thể mệt, và đủ đơn giản để ai cũng có thể bắt đầu.
          </p>
        </section>
      </>
    )
  }
};

const BlogDetail = () => {
  const { id } = useParams();
  const article = ARTICLES[id] || ARTICLES["van-hoa-tra-viet-nam"];

  useEffect(() => {
    // Scroll to top when loading this page
    window.scrollTo(0, 0);

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
  }, [id]);

  return (
    <main className="blog-detail-page">
      {/* FULL WIDTH HERO HEADER */}
      <header className="blog-detail__hero-header scroll-reveal">
        <h1 className="blog-detail__hero-title">{article.title}</h1>
        <span className="blog-detail__hero-meta">{article.date} | {article.category}</span>
      </header>

      {/* Article Content */}
      <article className="blog-detail__content">
        <p className="blog-detail__excerpt scroll-reveal">
          {article.excerpt}
        </p>
        
        {/* Render dynamic content */}
        {article.content}
      </article>

      {/* RELATED ARTICLES */}
      <section className="blog-detail__related scroll-reveal" style={{ maxWidth: '1200px', margin: '80px auto 40px', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', color: '#6b4d3f', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Bài viết liên quan
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {Object.entries(ARTICLES)
            .filter(([key]) => key !== id && key !== (id ? undefined : "van-hoa-tra-viet-nam")) // exclude current article length checking fallback
            .map(([key, relArticle]) => (
              <article key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to={`/blog/${key}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ width: '100%', aspectRatio: '8/5', overflow: 'hidden' }}>
                    <img loading="lazy" src={key === "tra-bancha" ? "https://images.meditea.vn/images/sp2.png" : "https://images.meditea.vn/images/sp1.png"} alt={relArticle.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                  <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>{relArticle.date}</div>
                    <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#2d251b', marginBottom: '8px', lineHeight: '1.4' }}>{relArticle.title}</h3>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                      {relArticle.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
        </div>
      </section>

      <footer className="blog-detail__footer scroll-reveal">
        <Link to="/blog" className="blog-detail__back-link">
          ← Quay lại danh sách bài viết
        </Link>
      </footer>
    </main>
  );
};

export default BlogDetail;
