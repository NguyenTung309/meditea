import { useState, useEffect } from "react";

const defaults = {
  hero: {
    title: "MediTEA",
    text: "Lắng nghe hồn trà Việt",
    image: "https://images.meditea.vn/images/video.mp4",
  },
  story: {
    title: "CÂU CHUYỆN MEDITEA",
    text: "Khi bắt đầu hành trình với trà, những người sáng lập MediTEA không hề nghĩ mình sẽ xây dựng một thương hiệu.",
    image:  "https://images.meditea.vn/images/tea_leaves.png",
    image2: "https://images.meditea.vn/images/anh3.png",
    image3: "https://images.meditea.vn/images/tea_plantation.png",
  },
  tea_collection: {
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
  core_values: {
    title: "MEDITEA – LÁ TRÀ GIÀ NGUYÊN BẢN",
    text: "Không phải lá non hái sớm. MediTEA chọn lá trà 1–3 năm tuổi từ vùng cao.",
    image: "https://images.meditea.vn/images/tea_plantation.png",
  },
  experience: {
    title: "TRẢI NGHIỆM",
    text: "Trà MediTEA được làm trong một không gian mở, nơi sân vườn, cây cối và thiên nhiên hòa vào từng công đoạn.",
    image: "https://images.meditea.vn/images/bandia.png",
  },
  commitment: {
    title: "CHỨNG NHỌN CHẤT LƯỢNG",
    text: "MediTEA tự hào đạt các chứng nhận uy tín về chất lượng sản phẩm và quy trình sản xuất.",
    image: "https://images.meditea.vn/images/chungchi1.png",
  },
  footer: {
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
      { title: "Liên hệ",                 desc: "/contact" },
      { title: "Tư liệu truyền thông",    desc: "/media" },
      { title: "Chính sách bảo mật",      desc: "/privacy" },
      { title: "Điều khoản và điều kiện", desc: "/terms" },
      { title: "Blog",                    desc: "/blog" },
      { title: "Câu hỏi thường gặp",      desc: "/faq" },
    ],
  },
};

export function useContent(sectionKey) {
  const [content, setContent] = useState(defaults[sectionKey] || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const mod = await import("../../config/ContentRequest");
        const res = await mod.getContentByKey(sectionKey);
        if (!cancelled && res?.metadata) {
          setContent({ ...defaults[sectionKey], ...res.metadata });
        }
      } catch {
        if (!cancelled) setContent(defaults[sectionKey] || {});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [sectionKey]);

  return { content, loading, defaults: defaults[sectionKey] || {} };
}
