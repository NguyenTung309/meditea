/**
 * Mix Rules — Logic tính toán thực tế khi pha trộn nguyên liệu
 * Bao gồm: cảnh báo xung đột, quá nhiều trà nền, caffeine, tác dụng phụ
 */

// ─── COMBO ĐẶC BIỆT ────────────────────────────────────
const SPECIAL_COMBOS = [
  {
    id: "classic-jasmine",
    name: "Trà Nhài Cổ Điển",
    requiredIds: ["green-tea", "jasmine"],
    bonus:
      "☕ Combo kinh điển! Hương nhài hoà quyện trà xanh tạo nên thức uống thanh tao, nhẹ nhàng.",
    bonusBenefits: ["Thư giãn sâu", "Tăng cường chống oxy hóa"],
  },
  {
    id: "immunity-boost",
    name: "Tăng Cường Miễn Dịch",
    requiredIds: ["green-tea", "ginger", "lemon"],
    bonus:
      "💪 Siêu combo miễn dịch! Gừng ấm + chanh vitamin C + trà xanh chống oxy hóa.",
    bonusBenefits: ["Tăng sức đề kháng x3"],
  },
  {
    id: "relaxation-blend",
    name: "Thư Giãn Tuyệt Đối",
    requiredIds: ["white-tea", "rose", "honey"],
    bonus: "🧘 Blend thư giãn hoàn hảo — nhẹ nhàng, ngọt ngào, thơm hoa hồng.",
    bonusBenefits: ["Giấc ngủ sâu", "Giảm stress hiệu quả"],
  },
  {
    id: "detox-tea",
    name: "Trà Thanh Lọc",
    requiredIds: ["chrysanthemum", "lemongrass", "honey"],
    bonus: "🌿 Thanh lọc cơ thể! Hoa cúc + sả + mật ong — giải độc nhẹ nhàng.",
    bonusBenefits: ["Giải độc gan", "Thanh nhiệt"],
  },
  {
    id: "warm-spice",
    name: "Trà Gia Vị Ấm",
    requiredIds: ["black-tea", "cinnamon", "ginger"],
    bonus: "🔥 Ấm áp kiểu chai tea! Trà đen đậm đà + quế gừng nồng ấm.",
    bonusBenefits: ["Tăng tuần hoàn máu", "Giữ ấm cơ thể"],
  },
  {
    id: "summer-peach",
    name: "Trà Đào Mùa Hè",
    requiredIds: ["oolong", "peach", "honey"],
    bonus: "🌞 Sảng khoái mùa hè! Ô long + đào + mật ong — ngọt mát tự nhiên.",
    bonusBenefits: ["Giải khát", "Bổ sung vitamin"],
  },
];

// ─── TƯƠNG THÍCH NGUYÊN LIỆU ───────────────────────────
const COMPATIBILITY_MAP = {
  "green-tea": ["jasmine", "mint", "lemon", "honey", "ginger", "chrysanthemum"],
  oolong: ["peach", "rose", "honey", "cinnamon", "ginger"],
  "black-tea": ["cinnamon", "ginger", "lemon", "honey", "mint"],
  "white-tea": ["rose", "jasmine", "peach", "honey", "chrysanthemum"],
  mint: ["green-tea", "lemon", "honey", "lemongrass"],
  lemongrass: ["ginger", "honey", "green-tea", "chrysanthemum", "mint"],
  jasmine: ["green-tea", "white-tea", "honey"],
  chrysanthemum: ["honey", "lemongrass", "white-tea", "green-tea"],
  rose: ["white-tea", "oolong", "honey", "peach"],
  ginger: ["black-tea", "lemon", "honey", "cinnamon", "lemongrass"],
  cinnamon: ["black-tea", "oolong", "ginger", "honey"],
  lemon: ["green-tea", "black-tea", "mint", "ginger", "honey"],
  peach: ["oolong", "white-tea", "rose", "honey"],
  honey: [
    "green-tea",
    "oolong",
    "black-tea",
    "white-tea",
    "ginger",
    "lemon",
    "rose",
  ],
};

// ═══════════════════════════════════════════════════════
// ENGINE TÍNH TOÁN THỰC TẾ
// ═══════════════════════════════════════════════════════

/**
 * Tính hương vị tổng hợp (trà nền có trọng số x1.5)
 */
export function calculateCombinedFlavors(selectedIngredients) {
  if (selectedIngredients.length === 0) {
    return { bitter: 0, sweet: 0, floral: 0, earthy: 0, fresh: 0 };
  }

  const flavorKeys = ["bitter", "sweet", "floral", "earthy", "fresh"];
  const combined = {};
  let totalWeight = 0;

  selectedIngredients.forEach((ing) => {
    const weight = ing.category === "base" ? 1.5 : 1;
    totalWeight += weight;
    flavorKeys.forEach((key) => {
      combined[key] = (combined[key] || 0) + (ing.flavors[key] || 0) * weight;
    });
  });

  flavorKeys.forEach((key) => {
    combined[key] = Math.round((combined[key] / totalWeight) * 10) / 10;
    combined[key] = Math.min(combined[key], 5);
  });

  return combined;
}

/**
 * Tổng hợp công dụng (loại bỏ trùng)
 */
export function aggregateBenefits(selectedIngredients) {
  const all = selectedIngredients.flatMap((ing) => ing.benefits);
  return [...new Set(all)];
}

/**
 * Kiểm tra combo đặc biệt
 */
export function checkSpecialCombos(selectedIngredients) {
  const selectedIds = selectedIngredients.map((ing) => ing.id);
  return SPECIAL_COMBOS.filter((combo) =>
    combo.requiredIds.every((reqId) => selectedIds.includes(reqId)),
  );
}

/**
 * ⭐ MỚI: Phân tích cảnh báo & điểm xấu khi mix
 * Trả về mảng các warning objects { type, severity, message }
 * severity: "info" | "warning" | "danger"
 */
export function analyzeWarnings(selectedIngredients) {
  const warnings = [];
  const selectedIds = selectedIngredients.map((ing) => ing.id);

  // --- 1. Quá nhiều trà nền ---
  const bases = selectedIngredients.filter((ing) => ing.category === "base");
  if (bases.length === 2) {
    warnings.push({
      type: "multi-base",
      severity: "warning",
      message: `⚠️ 2 loại trà nền (${bases.map((b) => b.name).join(" + ")}) — vị có thể bị lẫn lộn. Nên chọn 1 trà nền làm chủ đạo.`,
    });
  }
  if (bases.length >= 3) {
    warnings.push({
      type: "too-many-base",
      severity: "danger",
      message: `🚫 ${bases.length} loại trà nền quá nhiều! Các hương vị sẽ triệt tiêu nhau, tạo vị hỗn tạp không ngon. Tối đa 1-2 trà nền.`,
    });
  }

  // --- 2. Xung đột giữa các nguyên liệu ---
  selectedIngredients.forEach((ing) => {
    if (ing.conflictsWith) {
      ing.conflictsWith.forEach((conflictId) => {
        if (selectedIds.includes(conflictId)) {
          const conflictIng = selectedIngredients.find(
            (i) => i.id === conflictId,
          );
          if (conflictIng) {
            // Tránh duplicate (A xung đột B = B xung đột A)
            const pairKey = [ing.id, conflictId].sort().join("-");
            if (!warnings.some((w) => w.pairKey === pairKey)) {
              warnings.push({
                type: "conflict",
                severity: "warning",
                pairKey,
                message: `⚡ ${ing.name} + ${conflictIng.name} — ${getConflictReason(ing.id, conflictId)}`,
              });
            }
          }
        }
      });
    }
  });

  // --- 3. Caffeine tổng quá cao ---
  const totalCaffeine = selectedIngredients.reduce(
    (sum, ing) => sum + (ing.caffeineLevel || 0),
    0,
  );
  if (totalCaffeine >= 8) {
    warnings.push({
      type: "high-caffeine",
      severity: "danger",
      message: `☕ Hàm lượng caffeine rất cao (${totalCaffeine}/10)! Dễ gây hồi hộp, mất ngủ, tăng nhịp tim. Không nên uống buổi chiều-tối.`,
    });
  } else if (totalCaffeine >= 5) {
    warnings.push({
      type: "moderate-caffeine",
      severity: "warning",
      message: `☕ Caffeine khá cao (${totalCaffeine}/10). Người nhạy cảm caffeine nên cân nhắc, tránh uống buổi tối.`,
    });
  }

  // --- 4. Quá nhiều vị đắng ---
  const flavors = calculateCombinedFlavors(selectedIngredients);
  if (flavors.bitter >= 4) {
    warnings.push({
      type: "too-bitter",
      severity: "info",
      message: `😖 Vị đắng rất đậm (${flavors.bitter}/5). Thêm mật ong hoặc đào để cân bằng.`,
    });
  }

  // --- 5. Quá nhiều gia vị cay nóng ---
  const spices = selectedIngredients.filter((ing) => ing.category === "spice");
  if (spices.length >= 2) {
    warnings.push({
      type: "too-spicy",
      severity: "warning",
      message: `🌶️ ${spices.length} loại gia vị — có thể quá nóng cho cơ thể. Thêm bạc hà hoặc hoa cúc để hạ nhiệt.`,
    });
  }

  // --- 6. Tác dụng phụ đáng lưu ý ---
  const allSideEffects = selectedIngredients
    .filter((ing) => ing.sideEffects && ing.sideEffects.length > 0)
    .flatMap((ing) =>
      ing.sideEffects.map((se) => ({ ingredient: ing.name, effect: se })),
    );

  return { warnings, sideEffects: allSideEffects, totalCaffeine };
}

/** Lý do xung đột cụ thể */
function getConflictReason(id1, id2) {
  const pair = [id1, id2].sort().join("+");
  const reasons = {
    "black-tea+green-tea":
      "Vị chát đắng chồng chất, caffeine cộng dồn quá cao, hương bị lẫn lộn.",
    "black-tea+white-tea":
      "Trà đen quá mạnh sẽ hoàn toàn lấn át vị thanh nhẹ của trà trắng.",
    "green-tea+white-tea":
      "Cả hai đều nhẹ nhưng hương vị tương tự — không tạo sự khác biệt.",
    "ginger+jasmine": "Gừng cay nồng sẽ lấn át hoàn toàn hương nhài mỏng manh.",
    "ginger+rose": "Gừng cay mạnh triệt tiêu hương hoa hồng tinh tế.",
    "cinnamon+mint":
      "Quế nóng ấm vs bạc hà mát lạnh — tác dụng nhiệt đối nghịch nhau.",
  };
  return reasons[pair] || "Hai nguyên liệu này không hòa hợp tốt với nhau.";
}

/**
 * Gợi ý nguyên liệu bổ sung
 */
export function getSuggestions(selectedIngredients, allIngredients) {
  const selectedIds = selectedIngredients.map((ing) => ing.id);

  if (selectedIds.length === 0) {
    return allIngredients.filter((ing) => ing.category === "base");
  }

  const suggestedIds = new Set();
  selectedIds.forEach((id) => {
    const compatible = COMPATIBILITY_MAP[id] || [];
    compatible.forEach((cId) => {
      if (!selectedIds.includes(cId)) {
        suggestedIds.add(cId);
      }
    });
  });

  return allIngredients.filter((ing) => suggestedIds.has(ing.id));
}

/**
 * Tính điểm hài hoà (0-100)
 * BỊ TRỪ ĐIỂM nếu: xung đột, quá nhiều trà nền, caffeine cao, vị mất cân bằng
 */
export function calculateHarmonyScore(selectedIngredients) {
  if (selectedIngredients.length < 2) return 0;

  const flavors = calculateCombinedFlavors(selectedIngredients);
  const values = Object.values(flavors);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // Variance — càng thấp càng hài hoà
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;

  // Base score
  let score = Math.max(0, 100 - variance * 15);

  // Combo bonus (+15 mỗi combo)
  const combos = checkSpecialCombos(selectedIngredients);
  score += combos.length * 15;

  // PENALTIES (điểm trừ)
  const { warnings, totalCaffeine } = analyzeWarnings(selectedIngredients);

  warnings.forEach((w) => {
    if (w.type === "too-many-base") score -= 25;
    else if (w.type === "multi-base") score -= 10;
    else if (w.type === "conflict") score -= 15;
    else if (w.type === "high-caffeine") score -= 10;
    else if (w.type === "too-bitter") score -= 5;
    else if (w.type === "too-spicy") score -= 8;
  });

  return Math.min(100, Math.max(0, Math.round(score)));
}

export { SPECIAL_COMBOS, COMPATIBILITY_MAP };
