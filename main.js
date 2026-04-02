// ===== MAIN JS =====

document.addEventListener('DOMContentLoaded', () => {
  // Init cart
  Cart.init();

  // Cart toggle
  document.getElementById('cart-toggle').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Intersection observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  const animTargets = document.querySelectorAll(
    '.product-card, .why-card, .testi-card, .process-step'
  );
  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`;
    observer.observe(el);
  });

  // Newsletter subscribe
  const nlBtn = document.querySelector('.nl-btn');
  const nlInput = document.querySelector('.nl-input');
  if (nlBtn && nlInput) {
    nlBtn.addEventListener('click', () => {
      const email = nlInput.value.trim();
      if (!email || !email.includes('@')) {
        showToast('⚠ Please enter a valid email address.');
        return;
      }
      nlInput.value = '';
      showToast('🎉 Subscribed! Your 10% coupon is on its way.');
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (Cart.getItems().length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      showToast('🛒 Proceeding to checkout... (UI demo)');
    });
  }
});
