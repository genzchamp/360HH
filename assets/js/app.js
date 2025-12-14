// ===== Modal elements =====
const modal = document.getElementById("modal");
const iframe = document.getElementById("toolFrame");
const closeBtn = document.getElementById("modalClose");

// ===== Open tool when card is clicked =====
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const href = card.getAttribute("data-href");
    if (!href) return;

    iframe.src = href;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  });
});

// ===== Close modal =====
closeBtn.addEventListener("click", () => {
  iframe.src = "";
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
});

// ===== Close when clicking outside =====
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    iframe.src = "";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
});

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
