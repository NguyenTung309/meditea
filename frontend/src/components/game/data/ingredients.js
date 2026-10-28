/**
 * Database nguyên liệu trà — Medi-Tea Mini-game
 * Dữ liệu thực tế: caffeine, lượng khuyến nghị, tác dụng phụ, xung đột
 */

const CATEGORIES = {
  BASE: "base",
  HERB: "herb",
  FLOWER: "flower",
  SPICE: "spice",
  FRUIT: "fruit",
  SWEETENER: "sweetener",
};

const ingredients = [
  // ─── TRÀ NỀN ─────────────────────────────────────────
  {
    id: "green-tea",
    name: "Trà Xanh",
    category: CATEGORIES.BASE,
    emoji: "🍵",
    color: "#7ec88b",
    flavors: { bitter: 3, sweet: 1, floral: 2, earthy: 4, fresh: 3 },
    benefits: ["Chống oxy hóa", "Tỉnh táo", "Hỗ trợ giảm cân"],
    sideEffects: [
      "Gây mất ngủ nếu uống quá nhiều",
      "Kích ứng dạ dày khi uống lúc đói",
    ],
    caffeineLevel: 3, // 1-5, 5=cao nhất
    recommendedAmount: "2-3g lá / 200ml nước, nhiệt độ 70-80°C",
    description:
      "Lá trà xanh tươi mát, vị chát nhẹ. Nền tảng cho nhiều công thức.",
    conflictsWith: ["black-tea"], // mix 2 loại trà đậm = quá chát, caffeine cao
  },
  {
    id: "oolong",
    name: "Trà Ô Long",
    category: CATEGORIES.BASE,
    emoji: "🫖",
    color: "#c9954c",
    flavors: { bitter: 2, sweet: 3, floral: 3, earthy: 3, fresh: 2 },
    benefits: ["Hỗ trợ tiêu hóa", "Tăng trao đổi chất", "Giảm cholesterol"],
    sideEffects: ["Caffeine trung bình, uống buổi tối dễ mất ngủ"],
    caffeineLevel: 3,
    recommendedAmount: "3-5g lá / 200ml nước, nhiệt độ 85-95°C",
    description:
      "Trà bán lên men, hương thơm đặc trưng giữa trà xanh và trà đen.",
    conflictsWith: [],
  },
  {
    id: "black-tea",
    name: "Trà Đen",
    category: CATEGORIES.BASE,
    emoji: "☕",
    color: "#5c3d2e",
    flavors: { bitter: 4, sweet: 1, floral: 1, earthy: 5, fresh: 1 },
    benefits: [
      "Tăng năng lượng mạnh",
      "Tốt cho tim mạch",
      "Cải thiện tập trung",
    ],
    sideEffects: [
      "Caffeine cao — dễ gây hồi hộp, mất ngủ",
      "Nhuộm răng nếu uống thường xuyên",
      "Giảm hấp thu sắt",
    ],
    caffeineLevel: 5,
    recommendedAmount: "2-3g lá / 200ml nước, nhiệt độ 90-100°C",
    description: "Trà lên men hoàn toàn, vị đậm đà mạnh mẽ nhất.",
    conflictsWith: ["green-tea"], // mix với trà xanh = vị lộn xộn, caffeine quá cao
  },
  {
    id: "white-tea",
    name: "Trà Trắng",
    category: CATEGORIES.BASE,
    emoji: "🤍",
    color: "#f5f0e1",
    flavors: { bitter: 1, sweet: 3, floral: 4, earthy: 1, fresh: 4 },
    benefits: ["Chống lão hóa", "Tốt cho da", "Giàu chất chống oxy hóa nhất"],
    sideEffects: ["Ít tác dụng phụ — trà nhẹ nhất"],
    caffeineLevel: 1,
    recommendedAmount: "2-3g lá / 200ml nước, nhiệt độ 65-75°C",
    description: "Trà non nhẹ nhàng, hương thanh tao. Phù hợp pha đơn.",
    conflictsWith: ["black-tea"], // trà đen át hoàn toàn vị trà trắng
  },

  // ─── THẢO MỘC ────────────────────────────────────────
  {
    id: "mint",
    name: "Bạc Hà",
    category: CATEGORIES.HERB,
    emoji: "🌿",
    color: "#4ecca3",
    flavors: { bitter: 1, sweet: 2, floral: 1, earthy: 1, fresh: 5 },
    benefits: ["Làm mát", "Hỗ trợ tiêu hóa", "Giảm đau đầu"],
    sideEffects: [
      "Quá nhiều gây ợ nóng",
      "Không nên dùng khi có trào ngược dạ dày",
    ],
    caffeineLevel: 0,
    recommendedAmount: "3-5 lá tươi hoặc 1g lá khô",
    description: "Lá bạc hà tươi mát, the nhẹ.",
    conflictsWith: [],
  },
  {
    id: "lemongrass",
    name: "Sả",
    category: CATEGORIES.HERB,
    emoji: "🌾",
    color: "#c8d96f",
    flavors: { bitter: 1, sweet: 2, floral: 2, earthy: 2, fresh: 4 },
    benefits: ["Giải cảm", "Kháng khuẩn", "Giảm stress"],
    sideEffects: [
      "Uống quá nhiều có thể gây chóng mặt",
      "Phụ nữ mang thai nên hạn chế",
    ],
    caffeineLevel: 0,
    recommendedAmount: "1-2 cọng tươi hoặc 2g khô",
    description: "Sả tươi hương thơm dịu, vị chua nhẹ.",
    conflictsWith: [],
  },

  // ─── HOA ──────────────────────────────────────────────
  {
    id: "jasmine",
    name: "Hoa Nhài",
    category: CATEGORIES.FLOWER,
    emoji: "🌸",
    color: "#fdf6e3",
    flavors: { bitter: 0, sweet: 3, floral: 5, earthy: 0, fresh: 3 },
    benefits: ["Thư giãn", "Giảm lo âu", "Cải thiện giấc ngủ"],
    sideEffects: ["Hương quá đậm có thể gây đau đầu ở người nhạy cảm"],
    caffeineLevel: 0,
    recommendedAmount: "3-5 bông tươi hoặc 1-2g khô",
    description: "Hoa nhài thơm ngọt, hợp nhất với trà xanh và trà trắng.",
    conflictsWith: ["ginger"], // gừng cay át hương nhài mỏng manh
  },
  {
    id: "chrysanthemum",
    name: "Hoa Cúc",
    category: CATEGORIES.FLOWER,
    emoji: "🌼",
    color: "#f6d860",
    flavors: { bitter: 1, sweet: 3, floral: 4, earthy: 1, fresh: 3 },
    benefits: ["Thanh nhiệt", "Sáng mắt", "Giải độc gan"],
    sideEffects: [
      "Người dị ứng phấn hoa cần cẩn thận",
      "Tính hàn — người lạnh bụng nên hạn chế",
    ],
    caffeineLevel: 0,
    recommendedAmount: "3-5 bông khô",
    description:
      "Hoa cúc vàng, thanh mát và thơm nhẹ. Tốt để uống riêng hoặc với mật ong.",
    conflictsWith: [],
  },
  {
    id: "rose",
    name: "Hoa Hồng",
    category: CATEGORIES.FLOWER,
    emoji: "🌹",
    color: "#e8a0bf",
    flavors: { bitter: 0, sweet: 4, floral: 5, earthy: 0, fresh: 2 },
    benefits: ["Đẹp da", "Điều hòa kinh nguyệt", "Thư giãn tinh thần"],
    sideEffects: [
      "Tính ấm — uống nhiều dễ nóng trong người",
      "Phụ nữ mang thai cần tham khảo bác sĩ",
    ],
    caffeineLevel: 0,
    recommendedAmount: "3-5 bông khô",
    description: "Cánh hoa hồng khô, hương thơm lãng mạn.",
    conflictsWith: [],
  },

  // ─── GIA VỊ ───────────────────────────────────────────
  {
    id: "ginger",
    name: "Gừng",
    category: CATEGORIES.SPICE,
    emoji: "🫚",
    color: "#e8a838",
    flavors: { bitter: 2, sweet: 1, floral: 0, earthy: 3, fresh: 2 },
    benefits: ["Giữ ấm cơ thể", "Chống buồn nôn", "Tăng miễn dịch"],
    sideEffects: [
      "Cay nóng — dễ gây nóng trong nếu dùng nhiều",
      "Người bị loét dạ dày nên tránh",
      "Có thể tương tác thuốc chống đông máu",
    ],
    caffeineLevel: 0,
    recommendedAmount: "2-3 lát mỏng tươi hoặc 1g bột",
    description: "Gừng tươi cay nồng, ấm áp. Hợp trà đen, sả, chanh.",
    conflictsWith: ["jasmine", "rose"], // cay mạnh lấn át hương hoa mỏng manh
  },
  {
    id: "cinnamon",
    name: "Quế",
    category: CATEGORIES.SPICE,
    emoji: "🪵",
    color: "#a0522d",
    flavors: { bitter: 2, sweet: 3, floral: 1, earthy: 4, fresh: 0 },
    benefits: ["Ổn định đường huyết", "Kháng viêm", "Tăng tuần hoàn"],
    sideEffects: [
      "Quế Cassia chứa coumarin — hại gan nếu dùng quá nhiều",
      "Tối đa 1 thanh nhỏ/ngày",
      "Không nên dùng cho phụ nữ mang thai",
    ],
    caffeineLevel: 0,
    recommendedAmount: "1/2 thanh nhỏ hoặc 1/2 thìa bột",
    description: "Thanh quế thơm nồng, vị ngọt ấm. Hợp trà đen, ô long.",
    conflictsWith: ["mint"], // bạc hà mát + quế nóng = phản tác dụng
  },

  // ─── TRÁI CÂY ────────────────────────────────────────
  {
    id: "lemon",
    name: "Chanh",
    category: CATEGORIES.FRUIT,
    emoji: "🍋",
    color: "#f9e44c",
    flavors: { bitter: 1, sweet: 1, floral: 1, earthy: 0, fresh: 5 },
    benefits: ["Giàu vitamin C", "Tăng miễn dịch", "Giải khát"],
    sideEffects: [
      "Acid cao — hại men răng nếu uống thường xuyên",
      "Gây ợ chua ở người trào ngược",
    ],
    caffeineLevel: 0,
    recommendedAmount: "1-2 lát hoặc 1 thìa nước cốt",
    description: "Chanh tươi chua thanh, giàu vitamin. Hợp trà xanh, trà đen.",
    conflictsWith: [], // nhưng axit + sữa = vón cục (ghi nhận ở mixRules)
  },
  {
    id: "peach",
    name: "Đào",
    category: CATEGORIES.FRUIT,
    emoji: "🍑",
    color: "#ffb7a5",
    flavors: { bitter: 0, sweet: 5, floral: 3, earthy: 0, fresh: 3 },
    benefits: ["Bổ sung vitamin A", "Tốt cho da", "Hỗ trợ tiêu hóa"],
    sideEffects: ["Đường tự nhiên cao — người tiểu đường cần cân nhắc"],
    caffeineLevel: 0,
    recommendedAmount: "2-3 lát tươi hoặc 5g khô",
    description: "Đào ngọt mọng, hương thơm dịu dàng. Hợp ô long, trà trắng.",
    conflictsWith: [],
  },

  // ─── CHẤT TẠO NGỌT ───────────────────────────────────
  {
    id: "honey",
    name: "Mật Ong",
    category: CATEGORIES.SWEETENER,
    emoji: "🍯",
    color: "#f0a500",
    flavors: { bitter: 0, sweet: 5, floral: 2, earthy: 1, fresh: 0 },
    benefits: ["Kháng khuẩn tự nhiên", "Bổ sung năng lượng", "Làm dịu cổ họng"],
    sideEffects: [
      "Không cho vào nước sôi (>60°C) — mất enzyme",
      "Đường cao — không phù hợp cho người tiểu đường",
      "Trẻ dưới 1 tuổi không nên dùng",
    ],
    caffeineLevel: 0,
    recommendedAmount: "1-2 thìa cà phê, cho vào khi nước ấm <60°C",
    description: "Mật ong nguyên chất, ngọt thanh tự nhiên.",
    conflictsWith: [],
  },
];

export { ingredients, CATEGORIES };
