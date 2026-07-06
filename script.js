/* ============================================================
   ALAGOU NANIE – Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Loader ===
  const loader = document.getElementById('loader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.querySelector('.hero').classList.add('loaded');
    }, 800);
  });

  // Fallback: hide loader after 3s max
  setTimeout(() => {
    loader.classList.add('hidden');
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('loaded');
  }, 3000);

  // === Navbar scroll effect ===
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // === Scroll-based animations (IntersectionObserver) ===
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeElements() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      // Reset visibility for newly activated pages
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  }

  observeElements();

  // === Hash-based routing ===
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'accueil';
    const validPages = ['accueil', 'traiteur', 'epices', 'fridodoy'];
    
    if (validPages.includes(hash)) {
      showPage(hash);
    }
  }

  window.addEventListener('hashchange', handleHashChange);
  
  // Handle initial hash on page load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && initialHash !== 'accueil' && initialHash !== 'contact-section') {
    showPage(initialHash);
  }

  // === Parallax on hero (subtle) ===
  const heroSection = document.getElementById('hero-section');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroBg = heroSection.querySelector('.hero-bg img');
      if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(${1 + scrolled * 0.0001}) translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // === Form submission ===
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Get form values
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const subject = form.querySelector('select[name="subject"]').value;
    const message = form.querySelector('textarea[name="message"]').value;
    
    // Format subject for display
    const subjectMap = {
      'commande': 'Commande de produit',
      'devis': 'Demande de devis traiteur',
      'info': "Demande d'information"
    };
    const displaySubject = subjectMap[subject] || subject;

    // Build WhatsApp message
    const waText = `Bonjour ALAGOU NANIE !%0A%0A*Nom:* ${name}%0A*Email:* ${email}%0A*Sujet:* ${displaySubject}%0A*Message:*%0A${message}`;
    const waNumber = "50948548301";
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;
    
    // Animate button
    submitBtn.textContent = 'Ouverture de WhatsApp...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    
    // Redirect to WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
      
      // Reset button and form
      submitBtn.textContent = '✓ Message prêt !';
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, #6B7F5E, #8FA67F)';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    }, 800);
  };

  // === Smooth counter animation for "why" numbers ===
  const whyNumbers = document.querySelectorAll('.why-number');
  
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent);
        animateNumber(el, 0, target, 800);
        numberObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  whyNumbers.forEach(num => numberObserver.observe(num));

  function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(start + (end - start) * eased);
      el.textContent = String(current).padStart(2, '0');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // === Tilt effect on universe cards ===
  const cards = document.querySelectorAll('.universe-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// === Navigation functions (global scope) ===
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(`page-${pageName}`);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // Re-observe animations for the new page
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });
      
      targetPage.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }
  
  // Update nav links
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === pageName);
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateTo(pageName) {
  window.location.hash = pageName;
  showPage(pageName);
}

function scrollToFooter() {
  const footer = document.getElementById('contact-section');
  if (footer) {
    footer.scrollIntoView({ behavior: 'smooth' });
    // Focus on the first form field after scrolling
    setTimeout(() => {
      const nameInput = document.getElementById('form-name');
      if (nameInput) nameInput.focus();
    }, 800);
  }
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
}

function closeMenu() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
}
