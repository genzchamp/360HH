// Smooth hover animations boost
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("touchstart", () => {
        card.style.transform = "scale(1.08)";
        setTimeout(() => card.style.transform = "scale(1)", 150);
    });
});
