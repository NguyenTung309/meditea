import { Link } from "react-router-dom";
import "../App.css";
import { useContent } from "./hooks/useContent";

export default function Footer() {
  const { content } = useContent("footer");

  const socialMap = Object.fromEntries(
    (content.items || []).map((i) => [i.num, i.text])
  );
  const navLinks = content.steps || [];

  return (
    <footer className="ft">
      {/* Top Section */}
      <div className="ft__top-wrap">
        {/* Logo icon */}
        <div className="ft__logo">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 4C15 4 10 8 10 14c0 4 2 7 5 9l-1 8h12l-1-8c3-2 5-5 5-9 0-6-5-10-10-10z"
              fill="none"
              stroke="#f5f0eb"
              strokeWidth="1.5"
            />
            <path
              d="M20 8c2 0 4 1 5 3s1 4 0 6"
              fill="none"
              stroke="#f5f0eb"
              strokeWidth="1"
            />
            <circle cx="20" cy="12" r="2" fill="#f5f0eb" opacity="0.8" />
            <path
              d="M16 36h8"
              stroke="#f5f0eb"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Navigation links */}
        <nav className="ft__nav">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.desc}>{link.title}</Link>
          ))}
        </nav>

        {/* Email subscribe */}

        {/* Social icons */}
        <div className="ft__socials">
          <a href="https://www.facebook.com/profile.php?id=61590286351094&locale=vi_VN" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M14 8.6V7.2c0-.7.5-1.2 1.2-1.2H17V3h-2.2A4.3 4.3 0 0 0 10.5 7.2v1.4H8v3h2.5V21h3.5v-9.4h2.8l.5-3H14Z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/meditea.official/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5ZM17.6 7.4a.8.8 0 1 1-.8.8.8.8 0 0 1 .8-.8Z" />
            </svg>
          </a>
          <a href={socialMap.youtube || "#"} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M19.6 3.2H4.4A2.4 2.4 0 0 0 2 5.6v12.8A2.4 2.4 0 0 0 4.4 20.8h15.2a2.4 2.4 0 0 0 2.4-2.4V5.6a2.4 2.4 0 0 0-2.4-2.4ZM10 15.5V8.5l6 3.5Z" />
            </svg>
          </a>
          <a href={socialMap.zalo || "#"} aria-label="TikTok" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="ft__divider" />

      {/* Bottom info */}
      <div className="ft__info">
        <div className="ft__info-left">
          <p>@ 2026 MediTEA</p>
          <p>{content.address}</p>
          <p>tralagiameditea@gmail.com &nbsp;&nbsp; 0963118860</p>
        </div>
        <div className="ft__info-right">
          <p>
            <strong>HỘ KINH DOANH MEDIHOME RETREAT 1</strong>
          </p>
          <p>Mã số thuế: 001304042603</p>
          <p>Ngày cấp: 18/09/2025</p>
          <p>Nơi cấp: Phòng kinh tế xã Yên Xuân</p>
          <p>Địa chỉ: Thôn 6, Tiến Xuân, Xã Yên Xuân, Thành phố Hà Nội.</p>
        </div>
      </div>
    </footer>
  );
}
