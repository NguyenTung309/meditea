import { useEffect, useRef, useState } from "react";
import "./PanoramaViewer.css";

// SVG Icons based on user's image Request
const Icons = {
  Expand: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9"></polyline>
      <polyline points="9 21 3 21 3 15"></polyline>
      <line x1="21" y1="3" x2="14" y2="10"></line>
      <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
  ),
  Rotate: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
  ),
  Up: () => (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  ),
  Down: () => (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  PrevScene: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="19" x2="5" y2="5"></line>
      <polyline points="11 19 5 12 11 5"></polyline>
      <polyline points="19 19 13 12 19 5"></polyline>
    </svg>
  ),
  ZoomOut: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11 17 6 12 11 7"></polyline>
      <polyline points="18 17 13 12 18 7"></polyline>
    </svg>
  ),
  Left: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  Pause: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="5" width="3" height="14"></rect>
      <rect x="14" y="5" width="3" height="14"></rect>
    </svg>
  ),
  Play: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="7 4 19 12 7 20 7 4"></polygon>
    </svg>
  ),
  Right: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  ZoomIn: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="13 17 18 12 13 7"></polyline>
      <polyline points="6 17 11 12 6 7"></polyline>
    </svg>
  ),
  NextScene: () => (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="5" x2="19" y2="19"></line>
      <polyline points="13 5 19 12 13 19"></polyline>
      <polyline points="5 5 11 12 5 19"></polyline>
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
};

// Global Hotspot Renderer to overcome pure vanilla JS requirements from Pannellum
window.renderAnimatedHotspot = function (hotSpotDiv, args) {
  hotSpotDiv.classList.add("animated-hotspot-container");

  // Create an inner SVG or styled div acting as arrow
  const icon = document.createElement("div");
  icon.classList.add("animated-hotspot-arrow");

  // Add tooltip text
  if (args && args.text) {
    const tooltip = document.createElement("span");
    tooltip.classList.add("animated-hotspot-tooltip");
    tooltip.innerText = args.text;
    hotSpotDiv.appendChild(tooltip);
  }

  hotSpotDiv.appendChild(icon);
};

function PanoramaViewer({ onClose }) {
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenesList = ["scene1", "scene2"];
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // References to keep panning active while button held down
  const panRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (viewerRef.current && window.pannellum) {
      try {
        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          default: {
            firstScene: "scene1",
            sceneFadeDuration: 1000,
            autoLoad: true,
            autoRotate: -2,
            autoRotateInactivityDelay: 3000,
            compass: false,
            showControls: false, // Turn off default Pannellum controls to use custom UI
            showFullscreenCtrl: false,
            showZoomCtrl: false,
            mouseZoom: true,
            keyboardZoom: true,
          },
          scenes: {
            scene1: {
              type: "equirectangular",
              panorama: "https://images.meditea.vn/images/panorama_tea_hills.png",
              hfov: 110,
              minHfov: 50,
              maxHfov: 120,
              pitch: 0,
              yaw: 0,
              hotSpots: [
                {
                  pitch: -8, // Pointing slightly down to attach to the road path
                  yaw: -24, // Adjust this based on where the path is horizontally in the image
                  type: "scene",
                  sceneId: "scene2",
                  cssClass: "custom-hotspot",
                  createTooltipFunc: window.renderAnimatedHotspot,
                  createTooltipArgs: { text: "Đi tiếp" },
                },
              ],
            },
            scene2: {
              // Adding another arbitrary picture simulating the second scene
              type: "equirectangular",
              panorama: "https://images.meditea.vn/images/tea_plantation.JPG",
              hfov: 110,
              minHfov: 50,
              maxHfov: 120,
              pitch: 0,
              yaw: 0,
              hotSpots: [],
            },
          },
        });

        // Event listeners
        pannellumInstance.current.on("load", () => setIsLoading(false));
        pannellumInstance.current.on("scenechange", (sceneId) => {
          setCurrentSceneIndex(scenesList.indexOf(sceneId));
          setIsLoading(false);
        });
        pannellumInstance.current.on("error", (err) => {
          console.error("Pannellum error:", err);
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Failed to initialize Pannellum:", err);
        setIsLoading(false);
      }

      const fallback = setTimeout(() => setIsLoading(false), 5000);
      return () => {
        clearTimeout(fallback);
        if (pannellumInstance.current) {
          pannellumInstance.current.destroy();
        }
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.body.style.overflow = "";
      if (panRef.current) clearInterval(panRef.current);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 350);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // --- External Control Interactions ---
  const panViewer = (pitchDiff, yawDiff) => {
    if (!pannellumInstance.current) return;
    const p = pannellumInstance.current;
    p.setPitch(p.getPitch() + pitchDiff);
    p.setYaw(p.getYaw() + yawDiff);
  };

  const startPan = (pitchDiff, yawDiff) => {
    panViewer(pitchDiff, yawDiff);
    if (panRef.current) clearInterval(panRef.current);
    panRef.current = setInterval(() => {
      panViewer(pitchDiff, yawDiff);
    }, 50);
  };

  const stopPan = () => {
    if (panRef.current) clearInterval(panRef.current);
  };

  const zoomViewer = (zoomDiff) => {
    if (!pannellumInstance.current) return;
    const p = pannellumInstance.current;
    p.setHfov(p.getHfov() + zoomDiff);
  };

  const toggleAutoRotate = () => {
    if (!pannellumInstance.current) return;
    const p = pannellumInstance.current;
    if (isPlaying) {
      p.stopAutoRotate();
      setIsPlaying(false);
    } else {
      p.startAutoRotate(-2);
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!pannellumInstance.current) return;
    pannellumInstance.current.toggleFullscreen();
  };

  const switchScene = (direction) => {
    if (!pannellumInstance.current) return;
    setIsLoading(true);
    let newIndex = currentSceneIndex + direction;
    if (newIndex >= scenesList.length) newIndex = 0;
    if (newIndex < 0) newIndex = scenesList.length - 1;

    pannellumInstance.current.loadScene(scenesList[newIndex]);
  };

  // Helper for mouse/touch hold events
  const holdEvents = (pitch, yaw) => ({
    onMouseDown: () => startPan(pitch, yaw),
    onMouseUp: stopPan,
    onMouseLeave: stopPan,
    onTouchStart: () => startPan(pitch, yaw),
    onTouchEnd: stopPan,
  });

  return (
    <div
      className={`panorama-overlay ${isClosing ? "panorama-overlay--closing" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="panorama-container">
        {isLoading && (
          <div className="panorama-loading">
            <div className="panorama-loading__spinner" />
            <span className="panorama-loading__text">
              Đang chuyển không gian…
            </span>
          </div>
        )}

        <div ref={viewerRef} className="panorama-viewer" />

        {/* --- CUSTOM UI OVERLAYS --- */}

        {/* Close Button Top Right */}
        <button
          className="vr-btn vr-btn--close"
          onClick={handleClose}
          aria-label="Đóng"
        >
          <Icons.Close />
        </button>

        {/* Top Left Controls */}
        <div className="vr-top-left-controls">
          <button
            className="vr-btn"
            onClick={toggleFullscreen}
            title="Toàn màn hình"
          >
            <Icons.Expand />
          </button>
          <button
            className="vr-btn"
            onClick={toggleAutoRotate}
            title={isPlaying ? "Dừng xoay" : "Tự xoay"}
          >
            <Icons.Rotate />
          </button>
        </div>

        {/* Center Top Logo/Title */}
        <div className="vr-top-center-brand">
          <div className="vr-brand-title">
            <span>🌿</span> MediTEA
          </div>
        </div>

        {/* Bottom UI Layout */}
        <div className="vr-bottom-ui">
          <div className="vr-controls-wrapper">
            {/* Up Button positioned above the row */}
            <button
              className="vr-btn vr-btn-up"
              {...holdEvents(5, 0)}
              title="Nhìn Lên"
            >
              <Icons.Up />
            </button>

            {/* The main horizontal row of controls */}
            <div className="vr-btn-row">
              <button
                className="vr-btn"
                onClick={() => switchScene(-1)}
                title="Khu vực trước"
              >
                <Icons.PrevScene />
              </button>
              <button
                className="vr-btn"
                onClick={() => zoomViewer(10)}
                title="Thu nhỏ"
              >
                <Icons.ZoomOut />
              </button>
              <button
                className="vr-btn"
                {...holdEvents(0, -5)}
                title="Quay Trái"
              >
                <Icons.Left />
              </button>

              <button
                className="vr-btn vr-btn-play"
                onClick={toggleAutoRotate}
                title="Phát / Tạm dừng"
              >
                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              </button>

              <button
                className="vr-btn"
                {...holdEvents(0, 5)}
                title="Quay Phải"
              >
                <Icons.Right />
              </button>
              <button
                className="vr-btn"
                onClick={() => zoomViewer(-10)}
                title="Phóng to"
              >
                <Icons.ZoomIn />
              </button>
              <button
                className="vr-btn"
                onClick={() => switchScene(1)}
                title="Khu vực kế"
              >
                <Icons.NextScene />
              </button>
            </div>

            {/* Simulated Wooden Bar with Down Button */}
            <div className="vr-bottom-plank">
              <button
                className="vr-btn vr-btn-down"
                {...holdEvents(-5, 0)}
                title="Nhìn Xuống"
              >
                <Icons.Down />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanoramaViewer;
