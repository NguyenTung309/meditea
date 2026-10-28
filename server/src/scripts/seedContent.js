require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Content = require("../models/content.model");

const seedData = [
  {
    key: "hero",
    title: "MediTEA",
    text: "Lắng nghe hồn trà Việt",
    image: "https://images.meditea.vn/images/video.mp4",
  },
  {
    key: "story",
    title: "CÂU CHUYỆN MEDITEA",
    text: "Khi bắt đầu hành trình với trà, những người sáng lập MediTEA không hề nghĩ mình sẽ xây dựng một thương hiệu. Họ chỉ có một suy nghĩ đơn giản: Lá trà già trên núi cao đáng được tôn trọng, giữ nguyên bản tính và chia sẻ đến những người yêu trà đích thực.",
    image:  "https://images.meditea.vn/images/tea_leaves.png",
    image2: "https://images.meditea.vn/images/anh3.png",
    image3: "https://images.meditea.vn/images/tea_plantation.png",
  },
  {
    key: "values",
    title: "GIÁ TRỊ NGUYÊN BẢN",
    text: "Chúng tôi tin rằng giá trị của trà không nằm ở việc làm khác đi, mà ở việc để lá đủ năm trên cây, quá trình chế biến đủ chậm và hương vị đủ thật khi đến tay người dùng.",
    steps: [
      { title: "Lá trà đủ tuổi",       desc: "MediTEA chọn những lá trà đã ở lại trên cây đủ năm.",                                                    icon: "🌿", img: "https://images.meditea.vn/images/tea_leaves.png",    imgs: ["https://images.meditea.vn/images/tea_leaves.png"] },
      { title: "Chế biến thủ công",    desc: "Chúng tôi sao sấy trà trong từng mẻ nhỏ, kiểm soát nhiệt và thời gian bằng kinh nghiệm.",               icon: "🔥", img: "https://images.meditea.vn/images/sp2.png",           imgs: ["https://images.meditea.vn/images/sp2.png"] },
      { title: "Giữ vị nguyên bản",    desc: "MediTEA không sử dụng hương liệu hay phụ gia để điều chỉnh mùi vị.",                                     icon: "🍂", img: "https://images.meditea.vn/images/sp1.png",           imgs: ["https://images.meditea.vn/images/sp1.png"] },
      { title: "Trung thực nguồn gốc", desc: "Mỗi sản phẩm đều rõ ràng về vùng trồng, cách thu hái và quy trình chế biến.",                           icon: "📍", img: "https://images.meditea.vn/images/sp3.png",           imgs: ["https://images.meditea.vn/images/sp3.png"] },
      { title: "Gắn bó thiên nhiên",   desc: "Trà được sao sấy trong không gian gần gũi cây xanh và ánh sáng tự nhiên.",                              icon: "🌿", img: "https://images.meditea.vn/images/tea_plantation.png", imgs: ["https://images.meditea.vn/images/tea_plantation.png"] },
      { title: "Bền vững dài hạn",     desc: "MediTEA theo đuổi sự phát triển ổn định thay vì tăng trưởng nhanh.",                                     icon: "🌱", img: "https://images.meditea.vn/images/anh1.png",          imgs: ["https://images.meditea.vn/images/anh1.png"] },
    ],
  },
  {
    key: "core_values",
    title: "MEDITEA – LÁ TRÀ GIÀ NGUYÊN BẢN",
    text: "Không phải lá non hái sớm. MediTEA chọn lá trà 1–3 năm tuổi từ vùng cao.",
    image:  "https://images.meditea.vn/images/tea_plantation.png",
    image2: "https://images.meditea.vn/images/tea_leaves.png",
    items: [
      { num: "01", text: "Lá trà từ 1–3 năm tuổi" },
      { num: "02", text: "Không hương liệu, không phụ gia" },
      { num: "03", text: "Chế biến thủ công từng mẻ nhỏ" },
      { num: "04", text: "Nguồn gốc rõ ràng, minh bạch" },
    ],
  },
  {
    key: "tea_collection",
    title: "Bộ Sưu Tập Trà",
    text: "Không phải lá non hái sớm. MediTea chọn lá trà 1–3 năm tuổi từ vùng cao.",
    image: "https://images.meditea.vn/images/sp1.png",
    image2: "https://images.meditea.vn/images/sp3.png",
    image3: "https://images.meditea.vn/images/sp2.png",
    steps: [
      { title: "Trà lá già Bản lẻ 100g", desc: "Trà lá già MediTea – Bản lẻ 100g", icon: "Dòng sản phẩm cốt lõi.", img: "https://images.meditea.vn/images/sp1.png", imgs: [] },
      { title: "Gift Set Trà & Trải nghiệm", desc: "Gift Set MediTea – Trà & Trải nghiệm", icon: "Dòng quà tặng kết hợp.", img: "https://images.meditea.vn/images/sp3.png", imgs: [] },
      { title: "Trà lá già Bản sỉ 500g", desc: "Trà lá già MediTea – Bản sỉ 500g", icon: "Dành cho doanh nghiệp.", img: "https://images.meditea.vn/images/sp2.png", imgs: [] },
    ],
  },

  {
    key: "experience",
    title: "TRẢI NGHIỆM",
    text: "Trà MediTEA được làm trong một không gian mở, nơi sân vườn, cây cối và thiên nhiên hòa vào từng công đoạn.",
    image: "https://images.meditea.vn/images/bandia.png",
  },
  {
    key: "commitment",
    title: "CHỨNG NHẬN CHẤT LƯỢNG",
    text: "MediTEA tự hào đạt các chứng nhận uy tín về chất lượng sản phẩm và quy trình sản xuất.",
    image: "https://images.meditea.vn/images/chungchi1.png",
  },
  {
    key: "footer",
    address:       "Thạch Thất, Hà Nội, Việt Nam",
    phone:         "0247 3024 868",
    contact_email: "inquiries@meditea.vn",
    business_name: "Công Ty TNHH MediTEA",
    business_reg:  "123456789",
    reg_date:      "20/11/2026",
    reg_place:     "Sở Kế hoạch Đầu tư TP Hà Nội",
    items: [
      { num: "facebook",  text: "" },
      { num: "instagram", text: "" },
      { num: "youtube",   text: "" },
      { num: "zalo",      text: "" },
    ],
    steps: [
      { title: "Liên hệ",                 desc: "/contact", icon: "", img: "" },
      { title: "Tư liệu truyền thông",    desc: "/media",   icon: "", img: "" },
      { title: "Chính sách bảo mật",      desc: "/privacy", icon: "", img: "" },
      { title: "Điều khoản và điều kiện", desc: "/terms",   icon: "", img: "" },
      { title: "Blog",                    desc: "/blog",    icon: "", img: "" },
      { title: "Câu hỏi thường gặp",      desc: "/faq",     icon: "", img: "" },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Đã kết nối MongoDB");

  let count = 0;
  for (const item of seedData) {
    const { key, ...rest } = item;
    await Content.findOneAndUpdate({ key }, { key, ...rest }, { upsert: true, new: true });
    console.log(`  ✓ ${key}`);
    count++;
  }

  console.log(`\nSeeded ${count} sections thành công.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed thất bại:", err.message);
  process.exit(1);
});
