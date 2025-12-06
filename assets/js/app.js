// app.js — modal iframe, carousel controls, scroll reveal, UI niceties
document.addEventListener('DOMContentLoaded', () => {
  // year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Modal controls
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const toolFrame = document.getElementById('toolFrame');

  function openModal(url){
    if(!modal) return;
    if(url && url.trim() !== ''){
      toolFrame.src = url;
    } else {
      toolFrame.srcdoc = '<html><body style="font-family:Inter,Arial;background:#080808;color:#fff;padding:24px;"><h3 style="color:#D4AF37">Coming soon</h3><p style="color:#cfcfcf">This tool will be available here soon.</p><button onclick="parent.postMessage({type:\\'closeModal\\'}, \\\"*\\\")" style="background:#D4AF37;border:none;padding:10px;border-radius:8px;font-weight:700">Close</button></body></html>';
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

  // Wire up hero CTA
  const openFibHero = document.getElementById('openFibHero');
  openFibHero && openFibHero.addEventListener('click', ()=> openModal('pages/fx-tools/fib.html'));

  // Card clicks -> open url in iframe (cards with data-href)
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      // ignore clicks on disabled cards
      if(card.classList.contains('disabled')) return;
      const href = card.getAttribute('data-href') || card.querySelector('a')?.getAttribute('href') || card.dataset.href;
      const target = href || card.getAttribute('data-href') || card.dataset.href;
      if(target && target.trim()){
        openModal(target.trim());
      } else {
        openModal('');
      }
    });
  });

  // Carousel arrows (scroll by width)
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

  // Intersection observer for reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting) en.target.classList.add('inview');
    });
  }, {threshold: 0.18});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // touch feedback for mobile
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('touchstart', ()=> c.style.transform = 'translateY(-6px) scale(1.01)');
    c.addEventListener('touchend', ()=> c.style.transform = '');
    c.addEventListener('mousedown', ()=> c.style.transform = 'translateY(-6px) scale(1.01)');
    c.addEventListener('mouseup', ()=> c.style.transform = '');
  });

  // Listen for iframe request to close modal
  window.addEventListener('message', (ev) => {
    if(ev.data && ev.data.type === 'closeModal') closeModal();
  });
});