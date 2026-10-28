import React, { useState } from "react";
import TeaMixerBoard from "./TeaMixerBoard";
import "./TeaMixerFloat.css";

/**
 * TeaMixerFloat — Nút floating song song với ChatBot + overlay game
 */
export default function TeaMixerFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button — song song ChatBot */}
      <div className="game-fab-wrapper">
        {!isOpen && (
          <div className="game-fab-tooltip">
            <span>Chơi phối trà!</span>
          </div>
        )}
        <button
          className={`game-fab ${isOpen ? "is-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở mini-game phối trà"
        >
          {isOpen ? (
            "✕"
          ) : (
            <svg className="game-fab-leaf" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.73 2.27C18.77 3.31 20 5.42 20 8c0 4.14-3.07 7.54-7 7.95V18h2v2h-2v2h-2v-2H9v-2h2v-2.05C7.07 15.54 4 12.14 4 8c0-2.58 1.23-4.69 2.27-5.73L8 4c-1.6 1.6-2 3.56-2 4 0 3.31 2.69 6 6 6s6-2.69 6-6c0-.44-.4-2.4-2-4l1.73-1.73z" />
            </svg>
          )}
        </button>
      </div>

      {/* Game Overlay */}
      {isOpen && (
        <div className="game-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="game-overlay-content">
            <TeaMixerBoard onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
