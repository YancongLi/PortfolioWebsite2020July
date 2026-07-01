// Theme: follow the OS by default; a manual toggle wins and is remembered.
const root = document.documentElement;

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

document.getElementById("theme-toggle").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

document.getElementById("year").textContent = new Date().getFullYear();
