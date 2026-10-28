import "./FooterEbay.css";

const FooterEbay = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>Buy</h4>
            <ul>
              <li>
                <a href="#">Registration</a>
              </li>
              <li>
                <a href="#">Bidding & buying help</a>
              </li>
              <li>
                <a href="#">Stores</a>
              </li>
              <li>
                <a href="#">Creator Collections</a>
              </li>
              <li>
                <a href="#">eBay for Charity</a>
              </li>
              <li>
                <a href="#">Charity Shop</a>
              </li>
              <li>
                <a href="#">Seasonal Sales and events</a>
              </li>
              <li>
                <a href="#">eBay Gift Cards</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Sell</h4>
            <ul>
              <li>
                <a href="#">Start selling</a>
              </li>
              <li>
                <a href="#">How to sell</a>
              </li>
              <li>
                <a href="#">Business sellers</a>
              </li>
              <li>
                <a href="#">Affiliates</a>
              </li>
            </ul>

            <h5>Tools & apps</h5>
            <ul>
              <li>
                <a href="#">Developers</a>
              </li>
              <li>
                <a href="#">Security center</a>
              </li>
              <li>
                <a href="#">Site map</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>eBay companies</h4>
            <ul>
              <li>
                <a href="#">TCGplayer</a>
              </li>
            </ul>

            <h5>Stay connected</h5>
            <ul className="social-links">
              <li>
                <a href="#">
                  <span className="social-icon">f</span>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="social-icon">x</span>X (Twitter)
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>About eBay</h4>
            <ul>
              <li>
                <a href="#">Company info</a>
              </li>
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">
                  Deferred Prosecution Agreement with District of Massachusetts
                </a>
              </li>
              <li>
                <a href="#">Investors</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Diversity & Inclusion</a>
              </li>
              <li>
                <a href="#">Global Impact</a>
              </li>
              <li>
                <a href="#">Government relations</a>
              </li>
              <li>
                <a href="#">Advertise with us</a>
              </li>
              <li>
                <a href="#">Policies</a>
              </li>
              <li>
                <a href="#">Verified Rights Owner (VeRO) Program</a>
              </li>
              <li>
                <a href="#">eCI Licenses</a>
              </li>
              <li>
                <a href="#">Product Safety Tips</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Help & Contact</h4>
            <ul>
              <li>
                <a href="#">Seller Center</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">eBay Returns</a>
              </li>
              <li>
                <a href="#">eBay Money Back Guarantee</a>
              </li>
            </ul>

            <h5>Community</h5>
            <ul>
              <li>
                <a href="#">Announcements</a>
              </li>
              <li>
                <a href="#">eBay Community</a>
              </li>
              <li>
                <a href="#">eBay for Business Podcast</a>
              </li>
            </ul>

            <h5>eBay Sites</h5>
            <div className="site-select">
              <div className="left">
                <span className="flag">🇺🇸</span>
                <span>United States</span>
              </div>
              <i className="arrow"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        Copyright © 1995-2026 eBay Inc. All Rights Reserved.
        <a href="#">Accessibility</a>, <a href="#">User Agreement</a>,{" "}
        <a href="#">Privacy</a>, <a href="#">Consumer Health Data</a>,{" "}
        <a href="#">Payments Terms of Use</a>, <a href="#">Cookies</a>,{" "}
        <a href="#">CA Privacy Notice</a>, <a href="#">Your Privacy Choices</a>{" "}
        and <a href="#">AdChoice</a>
      </div>

      <div className="floating-buttons">
        <button className="float-btn">⌃</button>
        <button className="float-btn">?</button>
      </div>
    </footer>
  );
};
export default FooterEbay;
