// main.js: modal, carousel interactions, scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // Modal elements
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const toolFrame = document.getElementById('toolFrame');

  function openModalWith(url){
    if(!modal) return;
    toolFrame.src = url;
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

  // Close bindings
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  // Card clicks - load data-href into iframe
  document.querySelectorAll('.carousel .card').forEach(card => {
    card.addEventListener('click', () => {
      const href = card.getAttribute('data-href');
      if(href && href.trim() !== ''){
        openModalWith(href);
      } else {
        // placeholder behavior: show small modal content
        openModalWith('');
        // if no href, display a simple placeholder HTML in the iframe
        const html = `
          <html><body style="background:transparent;color:#fff;font-family:Inter,sans-serif;padding:24px;">
            <h3 style="color:${'#D4AF37'}">Coming soon</h3>
            <p style="color:#c9c9c9">This tool will be available soon. You can also build dedicated pages for each tool later.</p>
            <button onclick="parent.postMessage({type:'closeModal'}, '*')" style="padding:10px 12px;border-radius:8px;border:none;background:#D4AF37;font-weight:700;color:#071014;cursor:pointer">Close</button>
          </body></html>`;
        // write placeholder to frame after opening
        setTimeout(() => {
          try {
            const doc = toolFrame.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
          } catch (err) {
            // In cross-origin cases writing may fail; fallback
            toolFrame.srcdoc = html;
          }
        }, 80);
      }
    });
  });

  // Hero CTA open
  const openFibHero = document.getElementById('openFibHero');
  if(openFibHero) openFibHero.addEventListener('click', () => openModalWith('/forex/tools/fib-calculator.html'));

  // Listen for close message from iframe (used by placeholders)
  window.addEventListener('message', (ev) => {
    if(ev.data && ev.data.type === 'closeModal') closeModal();
  });

  // Intersection reveal for small fade-up
  const reveals = document.querySelectorAll('.carousel .card, .section-head, .hero');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('inview');
    });
  }, {threshold: 0.15});
  reveals.forEach(r => io.observe(r));

  // Add touch feedback for mobile
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('touchstart', () => c.classList.add('touch'));
    c.addEventListener('touchend', () => c.classList.remove('touch'));
    c.addEventListener('mousedown', () => c.classList.add('touch'));
    c.addEventListener('mouseup', () => c.classList.remove('touch'));
  });
});