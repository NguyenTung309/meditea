import { useEffect } from "react";
import About from "./homepage/About";
import Certificate from "./homepage/Certificate";
import ProductList from "./homepage/ProductList";
import ProductMain from "./homepage/ProductMain";
import Slide from "./homepage/Slide";

/* ─── Scroll Reveal Hook — supports directional reveals ─── */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          } else {
            entry.target.classList.remove("revealed"); // Reset when scrolling up
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    const timer = setTimeout(() => {
      document
        .querySelectorAll(
          ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom, .scroll-reveal-flip, .scroll-reveal-blur",
        )
        .forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}

function Homepage() {
  useScrollReveal();

  return (
    <div className="homepage-wrapper">
      <Slide />
      <About />
      <ProductList />
      <ProductMain />
      <Certificate />
    </div>
  );
}
export default Homepage;
