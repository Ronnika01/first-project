// Functional JS for navbar, smooth scroll, contact form (simulated), lightbox, and small UI helpers

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const navLinks = document.querySelector('.nav-links');

  // 1) Ensure mobile menu toggle exists
  let toggle = document.querySelector('.menu-toggle');
  if (!toggle && nav && navLinks) {
    toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
    nav.insertBefore(toggle, navLinks);
  }

  // Toggle behavior
  toggle?.addEventListener('click', () => {
    const opened = navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(!!opened));
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!nav?.contains(e.target) && navLinks?.classList.contains('active')) {
      navLinks.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // 2) Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        navLinks?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 3) Contact form: basic validation + simulated send + toast
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      const nameInput = form.querySelector('input[name="name"], input[placeholder="Your Name"]');
      const emailInput = form.querySelector('input[type="email"], input[placeholder="Your Email"]');
      const messageInput = form.querySelector('textarea[name="message"], textarea[placeholder="Your Message"]');

      const name = nameInput?.value?.trim() || '';
      const email = emailInput?.value?.trim() || '';
      const message = messageInput?.value?.trim() || '';

      if (!name || !email || !message) {
        toast('Please complete all fields.', 'error');
        return;
      }

      // disable submit
      const submitBtn = form.querySelector('button[type="submit"], .cta-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        const original = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';

        // Simulate network request
        await new Promise((r) => setTimeout(r, 900));

        submitBtn.disabled = false;
        submitBtn.textContent = original;
      } else {
        form.reset();
      }

      form.reset();
      toast('Message sent — thank you!', 'success');
    });
  }

  // 4) Lightbox for clickable images (background-image containers and imgs)
  function attachLightbox(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        let src = '';
        if (el.tagName === 'IMG') src = el.src;
        else {
          const bg = getComputedStyle(el).backgroundImage;
          src = bg && bg !== 'none' ? bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') : '';
        }
        if (!src) return;
        openLightbox(src, el.alt || '');
      });
    });
  }

  attachLightbox('.background-image img');
  attachLightbox('.product-card img');
  attachLightbox('.service-media');
  attachLightbox('.service-card img');

  function openLightbox(src, alt = '') {
    const overlay = document.createElement('div');
    overlay.className = 'site-lightbox';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
    overlay.innerHTML = `
      <div style="position:relative;max-width:1200px;max-height:90vh;">
        <img src="${encodeURI(src)}" alt="${escapeHtml(alt)}" style="max-width:100%;max-height:86vh;border-radius:8px;display:block;box-shadow:0 10px 40px rgba(0,0,0,.6)">
        <button aria-label="Close" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);color:#fff;border:0;padding:6px 10px;border-radius:6px;cursor:pointer;">✕</button>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.tagName === 'BUTTON') overlay.remove();
    });

    function onKey(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);
  }

  // 5) Toast / flash helper
  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = 'site-toast ' + type;
    el.textContent = message;
    el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:18px;padding:10px 14px;border-radius:8px;color:#fff;z-index:10000;opacity:0;transition:opacity .18s';
    if (type === 'success') el.style.background = '#16a34a';
    else if (type === 'error') el.style.background = '#dc2626';
    else el.style.background = '#111';
    document.body.appendChild(el);
    requestAnimationFrame(() => (el.style.opacity = '1'));
    setTimeout(() => (el.style.opacity = '0'), 2800);
    setTimeout(() => el.remove(), 3200);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});