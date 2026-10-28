import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Đừng quên: npm install axios
import { Modal } from "antd";
import "./Chatbot.css";

const defaultSuggestions = [
  "Trà xanh giảm cân",
  "Trà đen pha sữa",
  "Trà thảo mộc ngủ ngon",
  "Combo quà Tết",
  "Cách pha trà chuẩn",
];

// Lấy API URL từ biến môi trường của Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    const saved = localStorage.getItem("mediTeaChatWelcome");
    return saved ? JSON.parse(saved) : true;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mediTeaChatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("mediTeaChatUserName") || "";
  });
  const [fabPos, setFabPos] = useState(() => {
    const saved = localStorage.getItem("mediTeaFabPosition");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const fabRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const wasDragged = useRef(false);
  // Bỏ currentTopic vì AI sẽ tự quản lý context
  const messagesEndRef = useRef(null);

  const toggleOpen = () => {
    if (wasDragged.current) return;
    if (!open) {
      setOpen(true);
      // Không reset state nữa để giữ nguyên lịch sử chat
      // setShowWelcome(true);
      // setMessages([]);
      // setInput("");
    } else {
      setOpen(false);
    }
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, isTyping]);

  // Lưu lịch sử chat vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("mediTeaChatHistory", JSON.stringify(messages));
    localStorage.setItem("mediTeaChatWelcome", JSON.stringify(showWelcome));
    localStorage.setItem("mediTeaChatUserName", userName);
  }, [messages, showWelcome, userName]);

  // ====================== HÀM GỌI BACKEND AI API ======================
  const fetchAIResponse = async (userText, currentMessages) => {
    // Cắt bớt lịch sử, giữ lại khoảng 6 tin nhắn gần nhất để tránh gửi dữ liệu quá dài
    const recentMessages = currentMessages.slice(-6);
    
    // Đóng gói dữ liệu gửi đi, bao gồm tin nhắn mới nhất
    const messagesToSend = [...recentMessages, { sender: "user", text: userText }];

    // Gửi Request tới Backend nội bộ
    try {
      const response = await axios.post(
        `${API_URL}/api/chat/ask`,
        { 
          messages: messagesToSend,
          userName: userName
        },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data.data;
    } catch (error) {
      console.error("Lỗi gọi Chat API:", error);
      return `Dạ, hệ thống của Medi-Tea đang bận một chút để ủ trà. ${userName || "Bạn"} vui lòng thử lại sau vài giây nhé! 🍵`;
    }
  };

  // Drag handlers for FAB
  const handleDragStart = (e) => {
    wasDragged.current = false;
    if (e.button !== 0 && e.type !== 'touchstart') return;
    setIsDragging(true);
    const touch = e.touches ? e.touches[0] : e;
    dragStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      left: fabPos.x,
      top: fabPos.y
    };
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  };

  const handleDragMove = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    if (!touch) return;
    e.preventDefault();
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      wasDragged.current = true;
    }
    setFabPos({
      x: dragStart.current.left + dx,
      y: dragStart.current.top + dy
    });
  };

  const handleDragEnd = () => {
    // Delay reset so onClick can check wasDragged
    setTimeout(() => { wasDragged.current = false; }, 100);
    setIsDragging(false);
    setFabPos(p => {
      localStorage.setItem('mediTeaFabPosition', JSON.stringify(p));
      return p;
    });
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
  };

  const handleStartChat = () => {
    const name = input.trim();
    if (!name) return;
    setUserName(name);
    setShowWelcome(false);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages([
        {
          sender: "bot",
          text: `Chào ${name}! Medi-Tea rất vui được hỗ trợ bạn hôm nay 🍵 Bạn muốn tìm hiểu về dòng trà nào ạ?`,
          suggestions: defaultSuggestions,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleResetChat = () => {
    Modal.confirm({
      title: 'Xóa lịch sử trò chuyện',
      content: 'Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        localStorage.removeItem("mediTeaChatHistory");
        localStorage.removeItem("mediTeaChatWelcome");
        localStorage.removeItem("mediTeaChatUserName");
        setMessages([]);
        setUserName("");
        setShowWelcome(true);
        setInput("");
      },
    });
  };

  const handleSend = async (quickText) => {
    // Lấy text từ button gợi ý hoặc ô input
    const msgText =
      typeof quickText === "string" ? quickText.trim() : input.trim();
    if (!msgText) return;

    // Hiển thị tin nhắn của user ngay lập tức
    const newMessages = [...messages, { sender: "user", text: msgText }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Gọi API của Gemini
    const aiReplyText = await fetchAIResponse(msgText, messages);

    // Hiển thị tin nhắn trả về của Bot
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: aiReplyText,
      },
    ]);
    setIsTyping(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showWelcome) handleStartChat();
      else handleSend();
    }
  };

  return (
    <>
      <div
        className={`chatbot-fab-wrapper ${isDragging ? "dragging" : ""}`}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          transform: `translate(${fabPos.x}px, ${fabPos.y}px)`,
          zIndex: 9999,
          transition: isDragging ? "none" : "transform 0.2s ease"
        }}
      >
        {!open && (
          <div className="chatbot-speech-bubble">
            <span className="chatbot-speech-text">
              Xin chào, tôi có thể giúp gì được cho bạn ạ 🍵
            </span>
          </div>
        )}
        <div
          className={`chatbot-fab ${open ? "is-open" : ""}`}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={toggleOpen}
        >
          {open ? (
            "✕"
          ) : (
            <img
              src="/images/Mascot-01.png"
              alt="Medi-Tea"
              className="chatbot-fab-img"
            />
          )}
        </div>
      </div>

      <div className={`chatbot-window ${open ? "open" : ""}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-header-avatar">
              <img
                src="/images/Mascot-01.png"
                alt="Medi-Tea"
                className="chatbot-avatar-img"
              />
            </div>
            <div className="chatbot-header-text">
              <strong>Medi-Tea Bot</strong>
              <span>Trợ lý trà</span>
            </div>
          </div>
          <div className="chatbot-header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!showWelcome && (
              <button 
                className="chatbot-reset" 
                onClick={handleResetChat}
                title="Xóa lịch sử trò chuyện"
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0', display: 'flex' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            )}
            <button className="chatbot-close" onClick={toggleOpen} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px', padding: '0' }}>
              ✕
            </button>
          </div>
        </div>

        {showWelcome && (
          <div className="welcome-screen">
            <div className="welcome-avatar">
              <img
                src="/images/Mascot-01.png"
                alt="Medi-Tea"
                className="welcome-avatar-img"
              />
            </div>
            <div className="welcome-text">Vui lòng nhập tên của bạn</div>
            <input
              type="text"
              className="welcome-input"
              placeholder="Nhập tên của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="welcome-btn"
              onClick={handleStartChat}
              disabled={!input.trim()}
            >
              BẮT ĐẦU
            </button>
          </div>
        )}

        {!showWelcome && (
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.sender === "bot" ? (
                  <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  <div className="chat-bubble">{msg.text}</div>
                )}
                {msg.sender === "bot" && msg.suggestions && (
                  <div className="quick-replies">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="quick-btn"
                        onClick={() => handleSend(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {!showWelcome && (
          <div className="chatbot-input">
            <div className="chatbot-input-wrap">
              <input
                type="text"
                placeholder="Nhập câu hỏi về trà..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <button
              className="chatbot-send"
              onClick={() => handleSend()}
              disabled={!input.trim()}
            >
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
            {/* ===== CONTACT ICONS FLOAT ===== */}
      <div className="contact-float-wrapper">
        <button className="contact-float-toggle" id="contactFloatToggle" onClick={() => { const el = document.querySelector('.contact-float-icons'); el.classList.toggle('open'); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </button>
        <div className="contact-float-icons">
          <a href='tel:0963118860' className="contact-float-item contact-float-item--phone" id="contactPhone" aria-label="Call" title="0963118860">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span className="contact-float-phone-text">0963118860</span>
          </a>
          <a href='https://www.facebook.com/profile.php?id=61590286351094&locale=vi_VN' target="_blank" rel="noopener noreferrer" className="contact-float-item" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 8.6V7.2c0-.7.5-1.2 1.2-1.2H17V3h-2.2A4.3 4.3 0 0 0 10.5 7.2v1.4H8v3h2.5V21h3.5v-9.4h2.8l.5-3H14Z"/>
            </svg>
          </a>
          <a href='https://www.instagram.com/meditea.official/' target="_blank" rel="noopener noreferrer" className="contact-float-item" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5ZM17.6 7.4a.8.8 0 1 1-.8.8.8.8 0 0 1 .8-.8Z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
