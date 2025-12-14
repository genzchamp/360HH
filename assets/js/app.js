// app.js — modal iframe, carousel controls, reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // modal
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const toolFrame = document.getElementById('toolFrame');

  function openModal(url){
    if(!modal) return;
    if(url && url.trim() !== ''){
      // relative to repo root - safe
      toolFrame.src = url;
    } else {
      toolFrame.srcdoc = '<html><body style="background:#080808;color:#fff;padding:24px;font-family:Inter"><h3 style="color:#D4AF37">Coming soon</h3><p style="color:#cfcfcf">This tool will be available here soon.</p><button onclick="parent.postMessage({type:\\'closeModal\\'}, \\\"*\\\")" style="background:#D4AF37;border:none;padding:10px;border-radius:8px;font-weight:700">Close</button></body></html>';
    }
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    if(!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
    toolFrame.src = '';
    document.body.style.overflow = '';
  }

  modalClose && modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  // hero CTA opens fib
  const openFibHero = document.getElementById('openFibHero');
  openFibHero && openFibHero.addEventListener('click', ()=> openModal('pages/fx-tools/fib.html'));

  // card clicks
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      if(card.classList.contains('disabled')) return;
      const href = card.getAttribute('data-href') || card.dataset.href;
      if(href && href.trim()){
        openModal(href.trim());
      } else {
        openModal('');
      }
    });
  });

  // carousel arrows
  document.querySelectorAll('.carousel-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const carousel = document.getElementById(target + '-carousel');
      if(!carousel) return;
      const cardWidth = carousel.querySelector('.card')?.offsetWidth || 260;
      if(btn.classList.contains('prev')){
        carousel.scrollBy({left: -cardWidth - 16, behavior: 'smooth'});
      } else {
        carousel.scrollBy({left: cardWidth + 16, behavior: 'smooth'});
      }
    });
  });

  // reveal observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(en => { if(en.isIntersecting) en.target.classList.add('inview'); });
  }, {threshold: 0.18});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // touch feedback
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('touchstart', ()=> c.style.transform = 'translateY(-6px) scale(1.01)');
    c.addEventListener('touchend', ()=> c.style.transform = '');
    c.addEventListener('mousedown', ()=> c.style.transform = 'translateY(-6px) scale(1.01)');
    c.addEventListener('mouseup', ()=> c.style.transform = '');
  });

  // listen message from iframe to close
  window.addEventListener('message', (ev) => {
    if(ev.data && ev.data.type === 'closeModal') closeModal();
  });
});
