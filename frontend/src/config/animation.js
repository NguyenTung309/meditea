export function initHeroBg(options = {}) {
  const {
    images = ["https://images.meditea.vn/images/anh2.png", "https://images.meditea.vn/images/anh1.png"],
    holdMs = 3500,
    fadeMs = 1200,
  } = options;

  const layerA = document.querySelector(".hero__bgA");
  const layerB = document.querySelector(".hero__bgB");
  if (!layerA || !layerB) return () => {};

  const dots = Array.from(document.querySelectorAll(".dot[data-slide]"));

  let activeIsA = true;
  let index = 0;

  let timer = null;
  let lock = false;
  let token = 0; // dùng để hủy transition cũ khi click chen ngang

  // set transition theo fadeMs
  layerA.style.transition = `opacity ${fadeMs}ms ease`;
  layerB.style.transition = `opacity ${fadeMs}ms ease`;

  const preload = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    });

  const setDot = (i) => {
    dots.forEach((d) => d.classList.remove("show"));
    const btn = dots.find((d) => Number(d.dataset.slide) === i);
    if (btn) btn.classList.add("show");
  };

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      goTo((index + 1) % images.length, { fromAuto: true });
    }, holdMs);
  };

  const goTo = async (targetIndex, { fromAuto = false } = {}) => {
    // nếu đang fade mà user click -> cho phép chen ngang (cancel fade cũ)
    if (lock && fromAuto) return; // auto thì không chen khi đang lock
    if (targetIndex === index && !lock) {
      schedule();
      return;
    }

    token += 1;
    const myToken = token;

    lock = true;
    clearTimeout(timer);

    const nextSrc = images[targetIndex];
    await preload(nextSrc);

    // nếu có click mới xảy ra trong lúc preload => bỏ thao tác cũ
    if (myToken !== token) return;

    const active = activeIsA ? layerA : layerB;
    const idle = activeIsA ? layerB : layerA;

    idle.style.backgroundImage = `url("${nextSrc}")`;
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    idle.offsetHeight;

    idle.classList.add("is-active");
    active.classList.remove("is-active");

    index = targetIndex;
    setDot(index);
    activeIsA = !activeIsA;

    // đợi fade xong rồi mở khóa và lên lịch auto tiếp
    setTimeout(() => {
      if (myToken !== token) return;
      lock = false;
      schedule();
    }, fadeMs + 50);
  };

  // init
  layerA.style.backgroundImage = `url("${images[0]}")`;
  if (images[1]) layerB.style.backgroundImage = `url("${images[1]}")`;
  layerA.classList.add("is-active");
  layerB.classList.remove("is-active");
  setDot(0);
  schedule();

  // click interrupt
  const onDotClick = (e) => {
    const i = Number(e.currentTarget.dataset.slide);
    // click luôn được, dù đang fade / preload
    goTo(i, { fromAuto: false });
  };
  dots.forEach((d) => d.addEventListener("click", onDotClick));

  // tab visibility
  const onVisibility = () => {
    if (document.hidden) clearTimeout(timer);
    else schedule();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    clearTimeout(timer);
    dots.forEach((d) => d.removeEventListener("click", onDotClick));
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
