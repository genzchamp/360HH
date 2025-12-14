document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Card click handling
  document.querySelectorAll(".card[data-href]").forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("disabled")) return;

      const href = card.getAttribute("data-href");
      if (!href) return;

      openModal(href);
    });
  });

  // Hero button (Fib)
  const fibBtn = document.getElementById("openFibHero");
  if (fibBtn) {
    fibBtn.addEventListener("click", () => {
      openModal("pages/fx-tools/fib.html");
    });
  }

  // Modal close
  const modalClose = document.getElementById("modalClose");
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close modal on background click
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }
});

// ===== MODAL FUNCTIONS =====

function openModal(src) {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("toolFrame");

  iframe.src = src;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("modal");
  const iframe = document.getElementById("toolFrame");

  iframe.src = "";
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}
