import { useState, useRef, useEffect } from "react";
import "../../App.css";
import { useContent } from "../hooks/useContent";

function Slide() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const { content } = useContent("hero");

  // React's muted prop doesn't reliably set the DOM property — must set via ref
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  useEffect(() => {
    let interacted = false;

    const handleFirstInteraction = () => {
      if (interacted) return;
      interacted = true;

      if (videoRef.current) {
        setIsMuted(false);
        videoRef.current.muted = false;

        videoRef.current.play().catch(() => {
          setIsMuted(true);
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        });
      }

      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction);

    return cleanup;
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const title = content?.title || "MediTea";
  const subtitle = content?.text || "Lắng nghe hồn trà Việt";
  const videoSrc = content?.image || "https://images.meditea.vn/images/video.mp4";

  return (
    <section className="hero hero--video">
      <video ref={videoRef} className="hero__video-bg" autoPlay loop muted={isMuted} playsInline
        src={videoSrc} />
      <div className="hero__video-overlay" />

      <button className="hero__audio-toggle" onClick={() => {
          const next = !isMuted;
          setIsMuted(next);
          if (videoRef.current) videoRef.current.muted = next;
        }}
        aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          left: "20px", background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.3)", borderRadius: "50%",
          color: "white", width: "44px", height: "44px", zIndex: 10, fontSize: "20px",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div className="hero__content-center">
        <div className="hero__brand-logo">
          <h1 className="hero__logo-text">{title}</h1>
        </div>
        <h2 className="hero__subtitle">{subtitle}</h2>

        <button className="hero__play-toggle" onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng" : "Phát video"}
        >
          {isPlaying ? <span className="hero__icon-pause">||</span> : <span className="hero__icon-play">▶</span>}
        </button>
      </div>
    </section>
  );
}

export default Slide;