// Stars, falling feathers, typing line, reveal-on-scroll and cursor sparkles.
(() => {
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  // Twinkling stars and soft glowing dots in the background.
  const sky = document.querySelector(".sky");
  const area = innerWidth * innerHeight;
  const stars = Math.round(Math.min(46, area / 30000));
  const dots = Math.round(Math.min(90, area / 14000));
  for (let i = 0; i < stars; i++) {
    const s = document.createElement("i");
    s.className = "star";
    s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;--s:${rand(6, 18).toFixed(1)}px;--d:${rand(3, 7).toFixed(1)}s;--delay:-${rand(0, 7).toFixed(1)}s`;
    sky.append(s);
  }
  for (let i = 0; i < dots; i++) {
    const d = document.createElement("i");
    d.className = "dot";
    d.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;--s:${rand(1.5, 4).toFixed(1)}px;--d:${rand(4, 9).toFixed(1)}s;--delay:-${rand(0, 9).toFixed(1)}s`;
    sky.append(d);
  }

  // A few feathers drifting down.
  if (!calm) {
    const box = document.querySelector(".feathers");
    const count = innerWidth < 760 ? 3 : 6;
    for (let i = 0; i < count; i++) {
      const f = document.createElement("img");
      f.className = "feather";
      f.src = "assets/feather.webp";
      f.alt = "";
      const d = rand(26, 44);
      f.style.cssText = `left:${rand(2, 94)}%;--w:${rand(34, 70).toFixed(0)}px;--o:${rand(0.3, 0.6).toFixed(2)};--d:${d.toFixed(0)}s;--delay:-${rand(0, d).toFixed(0)}s;--sway:${rand(-70, 70).toFixed(0)}px;--r0:${rand(-35, -5).toFixed(0)}deg;--r1:${rand(5, 35).toFixed(0)}deg`;
      box.append(f);
    }
  }

  // Typing line under the name.
  const typed = document.querySelector(".typed");
  const lines = [
    "Не кусаюсь (почти)",
    "вайбкодер · идея · промпт · релиз",
    "Windows-игра на Android, без Wine",
    "проверено на Pixel 10 Pro",
  ];
  if (typed && !calm) {
    let line = 0;
    let pos = lines[0].length;
    let erasing = true;
    const tick = () => {
      if (erasing) {
        pos--;
        if (pos <= 0) { erasing = false; line = (line + 1) % lines.length; }
      } else {
        pos++;
      }
      typed.textContent = lines[line].slice(0, Math.max(pos, 0));
      let wait = erasing ? 32 : 70;
      if (!erasing && pos >= lines[line].length) { erasing = true; wait = 2200; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 2600);
  }

  // Fade sections in as they scroll into view.
  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !calm) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("is-visible"));
  }

  // Highlight the nav link of the section on screen.
  const bar = document.querySelector(".nav__links");
  const links = [...bar.querySelectorAll("a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  let shown = -1;
  const mark = () => {
    let current = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = i; });
    if (current === shown) return;
    shown = current;
    links.forEach((a, i) => a.classList.toggle("is-active", i === current));
    // On phones the links scroll sideways: keep the active one in view.
    const a = links[current];
    if (a && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: calm ? "auto" : "smooth" });
    }
  };
  addEventListener("scroll", mark, { passive: true });
  mark();

  // Sparkles that trail the mouse and burst on click.
  if (calm) return;
  const spark = (x, y, dx, dy, size) => {
    const s = document.createElement("i");
    s.className = "spark";
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${dx}px;--dy:${dy}px;width:${size}px;height:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px`;
    document.body.append(s);
    s.addEventListener("animationend", () => s.remove());
  };
  if (matchMedia("(pointer: fine)").matches) {
    let last = 0;
    addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      spark(e.clientX, e.clientY, rand(-12, 12), rand(10, 28), rand(6, 12));
    }, { passive: true });
  }
  addEventListener("pointerdown", (e) => {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + rand(-0.2, 0.2);
      const r = rand(30, 60);
      spark(e.clientX, e.clientY, Math.cos(a) * r, Math.sin(a) * r, rand(8, 14));
    }
  }, { passive: true });
})();
