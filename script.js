const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// --- Theme: follow the OS by default; a manual toggle wins and is remembered.

const stored = localStorage.getItem("theme");
if (stored === "light" || stored === "dark") {
  root.dataset.theme = stored;
}

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  if (reducedMotion.matches || !document.startViewTransition) {
    apply();
    return;
  }

  // Sweep the new theme out from the toggle button in a growing circle
  const { left, top, width, height } = toggle.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 450,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// --- Scroll reveal: fade sections in as they enter the viewport.
// The .reveal class is only added here, so without JS everything stays visible.

const revealTargets = document.querySelectorAll(
  ".section h2, .about-grid p, .timeline > li, .skill-group, .contact p, .contact-actions"
);

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  // leave elements untouched
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" }
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// --- Terminal typewriter: type out the hero card text, keeping the
// colored prompt spans intact by typing each text node in order.

const terminalCode = document.querySelector(".terminal-body code");

if (terminalCode && !reducedMotion.matches) {
  const textNodes = [];
  (function collect(node) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        textNodes.push([child, child.textContent]);
      } else {
        collect(child);
      }
    }
  })(terminalCode);

  textNodes.forEach(([node]) => (node.textContent = ""));

  const cursor = document.createElement("span");
  cursor.className = "t-cursor";
  terminalCode.appendChild(cursor);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  (async () => {
    await sleep(700);
    for (const [node, text] of textNodes) {
      node.after(cursor);
      for (const char of text) {
        node.textContent += char;
        await sleep(char === "\n" ? 130 : 16);
      }
    }
  })();
}
