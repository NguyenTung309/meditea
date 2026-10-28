import React, { useState } from "react";
import { useTeaMixer } from "./hooks/useTeaMixer";
import "./TeaMixer.css";

const TeaMixerBoard = ({ onClose }) => {
  const {
    allIngredients,
    selectedIngredients,
    maxIngredients,
    combinedFlavors,
    benefits,
    isBrewing,
    brewResult,
    addIngredient,
    removeIngredient,
    resetMix,
    evaluateMix
  } = useTeaMixer();

  // Effect States
  const [sparkles, setSparkles] = useState([]);

  // Compute Mascot State Context
  let mascotStateClass = "mascot-state-guiding";
  if (brewResult) mascotStateClass = "mascot-state-result";
  else if (isBrewing) mascotStateClass = "mascot-state-brewing";
  else if (selectedIngredients.length > 0) mascotStateClass = "mascot-state-mixing";

  const handleAddIngredient = (ing, event) => {
    addIngredient(ing.id);

    // Create Sparkle Effect at click position
    if (event) {
      const id = Date.now();
      setSparkles(prev => [...prev, { id, x: event.clientX, y: event.clientY }]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== id));
      }, 800);
    }
  };

  // Mock AI Chat Logic
  const [chatInput, setChatInput] = useState("");
  const [mascotCustomSpeech, setMascotCustomSpeech] = useState("");

  const handleAskMascot = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const text = chatInput.toLowerCase();
    let response = "Lão chưa rõ ý bạn lắm. Bạn thử nói rõ hơn xem, ví dụ như 'mất ngủ' hay 'thanh lọc'?";

    if (text.includes("mất ngủ") || text.includes("ngủ") || text.includes("an thần")) {
      response = "Người mất ngủ à? Cúc Chi và Hoa Nhài kết hợp sinh ra hương thơm xoa dịu thần kinh, phối cùng Trà Ô Long sẽ rất êm bụng để dễ ngủ. Thử ngay xem sao!";
    } else if (text.includes("thanh lọc") || text.includes("mát") || text.includes("detox")) {
      response = "Cam Quýt và Trà Xanh là bộ đôi thanh lọc tuyệt vời. Vị the mát giúp xua tan mệt mỏi đấy!";
    } else if (text.includes("đẹp da") || text.includes("chống lão hóa") || text.includes("vẻ đẹp")) {
      response = "Dưỡng nhan thì cứ Nụ Hồng Cổ mà dùng! Hương thơm quyến rũ, kết hợp cùng Trà Đen sẽ giúp khí huyết lưu thông, da dẻ hồng hào.";
    }

    setMascotCustomSpeech(response);
    setChatInput("");
  };

  const selectedIds = selectedIngredients.map((ing) => ing.id);
  const isFull = selectedIngredients.length >= maxIngredients;
  const hasBase = selectedIngredients.some(ing => ing.category === "base");

  // Separate ingredients map
  const baseTeas = allIngredients.filter(ing => ing.category === "base");
  const herbs = allIngredients.filter(ing => ing.category !== "base");

  // Mascot logic
  let mascotReaction = "Người Mới";
  let mascotSpeech = "Hôm nay bạn muốn thử công thức nào? Nhập câu hỏi bên dưới để Lão gợi ý nhé!";
  if (mascotCustomSpeech) {
    mascotSpeech = mascotCustomSpeech;
    mascotReaction = "Lão Trà đang gợi ý";
  } else if (isBrewing) {
    mascotReaction = "Đang pha chế...";
    mascotSpeech = "Chà chà, để Lão xem kỹ năng của bạn nhé...";
  } else if (brewResult) {
    if (brewResult.rank === "S") mascotSpeech = "Tuyệt hảo! Khí vị này thật hiếm có!";
    if (brewResult.rank === "A") mascotSpeech = "Độc đáo lắm! Một sự kết hợp rất thú vị.";
    if (brewResult.rank === "C") mascotSpeech = "Khụ khụ... Vị này hơi đột phá quá...";
    mascotReaction = `Hoàn thành (Hạng ${brewResult.rank})`;
  } else if (selectedIngredients.length > 0) {
    const names = selectedIngredients.map(ing => ing.name);
    if (names.length === 1) {
      mascotSpeech = `Chà, khởi đầu bằng ${names[0]}! Sự lựa chọn rất tinh tế để làm nền tảng.`;
    } else if (names.length === 2) {
      mascotSpeech = `${names[0]} đi cùng ${names[1]} à? Lão bắt đầu ngửi thấy hương thơm tỏa ra rồi đấy!`;
    } else if (names.length === 3) {
      mascotSpeech = `Tuyệt vời! ${names[0]}, ${names[1]} và ${names[2]} đang quyện vào nhau. Thêm 1 vị nữa hoặc ủ ngay nào!`;
    } else if (names.length >= 4) {
      mascotSpeech = `Đủ 4 vị rồi! Bức tranh hương vị đã hoàn thiện. Ấn nút 'Ủ Trà Ngay' đi nào, Lão háo hức quá!`;
    }
    mascotReaction = `Đang chọn lá (${names.length}/4)`;
  }

  return (
    <div className="tea-mixer-page new-game-ui">
      {/* Top Header */}
      <div className="game-header-top">
        <div style={{ width: '80px' }}></div> {/* Spacer for flex balance */}
        <div className="game-title-center">
          <h1>HỌC VIỆN MEDI TEA - 2026</h1>
          <p>Trạm Mix Trà MediTEA - Thử Tài Pha Chế</p>
        </div>
        <button className="btn-close-game" onClick={onClose}>
          ✕ Đóng
        </button>
      </div>

      {/* Main Game Container */}
      <div className="game-main-content">
        <div className="curtain-top"></div>
        <div className="bamboo-mat-floor"></div>

        {/* Cute Details / Effects */}
        <div className="cute-decorations">
          <span className="decor d1">✨</span>
          <span className="decor d2">🍃</span>
          <span className="decor d3">🌸</span>
          <span className="decor d4">✨</span>
          <span className="decor d5">🌼</span>
        </div>

        <div className="layout-left">
          <div className={`mascot-area ${mascotStateClass}`}>
            <img loading="lazy" src="https://images.meditea.vn/images/linhvat.png" alt="Linh vật" className="mascot-img" />
            
            <div className="mascot-speech-bubble">
              <h3>TRÀ LÃO NÔNG</h3>
              <p className="level-text">{mascotReaction}</p>
              <p className="mascot-dialogue">"{mascotSpeech}"</p>
            </div>

            <form onSubmit={handleAskMascot} className="ai-chat-box">
              <input 
                type="text" 
                placeholder="VD: Tôi bị mất ngủ thì..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit">→</button>
            </form>

          </div>
        </div>

        {/* Global Sparkles */}
        {sparkles.map(s => (
          <div
            key={s.id}
            className="sparkle-effect"
            style={{ left: s.x - 20, top: s.y - 20 }}
          >
            ✨
          </div>
        ))}

        {/* Center Panel (Info & Teapot) */}
        <div className="layout-center">
          
          <div className="brew-status-text">
            <p className="p-accent" style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Phối vị ngay - MediTea chấm điểm</p>
            <p className="bold-yellow" style={{ fontSize: '0.8rem' }}>Click để thêm vào khay</p>
          </div>

          {/* Capacity Board Top */}
          <div className="capacity-board-top" style={{ transform: 'scale(0.8)', marginBottom: '10px' }}>
             <div className="board-text">
               <span className="bold">{selectedIngredients.length} / {maxIngredients}</span><br/>
               Nguyên liệu
             </div>
          </div>

          <div className="selected-tray">
            {selectedIngredients.map((ing) => (
              <div key={`tray-${ing.id}`} className="tray-item" title={ing.name}>
                 <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>{ing.emoji}</span>
              </div>
            ))}
            {/* Fill empty slots visually */}
            {Array.from({ length: maxIngredients - selectedIngredients.length }).map((_, idx) => (
              <div key={`empty-${idx}`} className="tray-item empty"></div>
            ))}
          </div>

          <button
            className="btn-brew-action"
            onClick={evaluateMix}
            disabled={selectedIngredients.length === 0 || isBrewing || brewResult !== null}
            style={{ opacity: (selectedIngredients.length > 0 && !isBrewing && !brewResult) ? 1 : 0.5 }}
          >
            {isBrewing ? 'Đang ủ...' : 'Ủ Trà Ngay 🍵'}
          </button>

          {/* Teapot & Info */}
          <div className={`teapot-container ${isBrewing ? 'teapot-boiling' : ''}`}>
              {isBrewing && (
                <>
                  <div className="steam-container">
                    <div className="steam s1"></div>
                    <div className="steam s2"></div>
                    <div className="steam s3"></div>
                  </div>
                  <div className="pour-animation"></div>
                  <div className="splash-container">
                    <div className="splash-bubble" style={{"--r": Math.random()}}></div>
                    <div className="splash-bubble" style={{"--r": Math.random()}}></div>
                    <div className="splash-bubble" style={{"--r": Math.random()}}></div>
                  </div>
                </>
              )}
            <div className="temp-time-badge">
              {isBrewing ? "95°C - Đang ủ..." : "Chưa ủ"}
            </div>
            <div className="equipment">
               <div className="thermos">🥛</div>
               <div className="teapot">🫖</div>
            </div>
          </div>

          {/* Brew Result Popup */}
          {brewResult && !isBrewing && (
            <div className="result-overlay">
               <div className="result-popup">

                  {/* Fireworks if visually rewarding rank */}
                  {(brewResult.rank === 'S' || brewResult.rank === 'A') && (
                    <div className="fireworks-container">
                      <div className="firework fw1"></div>
                      <div className="firework fw2"></div>
                      <div className="firework fw3"></div>
                    </div>
                  )}

                  <h2 className={`rank-${brewResult.rank}`}>HẠNG {brewResult.rank}</h2>
                  <p className="feedback-text">"{brewResult.feedback}"</p>
                  <div className="voucher-box">
                    <span>🎁</span> Nhận Voucher giảm {brewResult.voucher}
                  </div>
                  <div className="result-actions">
                    <button className="btn-buy" onClick={() => alert("Đã thêm vào giỏ hàng!")}>Mua ngay công thức</button>
                    <button className="btn-reset" onClick={resetMix}>Pha lại từ đầu</button>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Right Wood Board with Ceramic Bowls */}
        <div className="layout-right">
          <div className="wooden-tray-board">
            
            <h4 className="tray-title">Trà Nền (Chọn 1)</h4>
            <div className="tray-grid-3">
              {baseTeas.map(ing => {
                const isSelected = selectedIds.includes(ing.id);
                const isDisabled = (!isSelected && hasBase) || isBrewing || brewResult;
                return (
                  <div
                    key={ing.id}
                    className={`ceramic-bowl-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'dimmed' : ''}`}
                    onClick={(e) => {
                      if (isSelected) removeIngredient(ing.id);
                      else if (!isDisabled) handleAddIngredient(ing, e);
                    }}
                  >
                    <div className="ceramic-bowl">
                      <div className="bowl-edge"></div>
                      <span className="bowl-emoji">{ing.emoji}</span>
                    </div>
                    <p>{ing.name}</p>
                  </div>
                );
              })}
            </div>

            <h4 className="tray-title">Thảo Mộc / Hoa (Tối đa 3)</h4>
            <div className="tray-grid-4">
              {herbs.map(ing => {
                const isSelected = selectedIds.includes(ing.id);
                const isDisabled = (isFull && !isSelected) || isBrewing || brewResult;
                return (
                  <div
                    key={ing.id}
                    className={`ceramic-bowl-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'dimmed' : ''}`}
                    onClick={(e) => {
                      if (isSelected) removeIngredient(ing.id);
                      else if (!isDisabled) handleAddIngredient(ing, e);
                    }}
                  >
                    <div className="ceramic-bowl">
                      <div className="bowl-edge"></div>
                      <span className="bowl-emoji">{ing.emoji}</span>
                    </div>
                    <p>{ing.name}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default TeaMixerBoard;
