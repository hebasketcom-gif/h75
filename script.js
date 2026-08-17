/**
 * ==========================================================================
 * MARLIYA SULTAN — PORTFOLIO JAVASCRIPT
 * Junior Dentist | BDS (2024) | UAE Career Opportunities
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initTimelineProgress();
  initScrollProgress();
  initBackToTop();
  initImageFallback();
});

/**
 * 1. LIGHT / DARK MODE TOGGLE WITH LOCALSTORAGE
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('marliya_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    // Default to Elegant Dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('marliya_portfolio_theme', newTheme);
  });
}

/**
 * 2. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
 */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll background toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Section highlight on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
}

/**
 * 3. MOBILE HAMBURGER MENU & DRAWER
 */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('nav-hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer) return;

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('active');
    mobileDrawer.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile drawer when clicking any link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('open') &&
      !mobileDrawer.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      hamburgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  });

  reveals.forEach((el) => revealObserver.observe(el));
}

/**
 * 5. TIMELINE LINE PROGRESS ANIMATION
 */
function initTimelineProgress() {
  const timelineSection = document.getElementById('journey');
  const lineFill = document.querySelector('.timeline-line-fill');
  if (!timelineSection || !lineFill) return;

  window.addEventListener('scroll', () => {
    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalDist = rect.height;
      const currentProgress = (windowHeight - rect.top) / (totalDist + windowHeight * 0.5);
      const percentage = Math.min(Math.max(currentProgress * 100, 0), 100);
      lineFill.style.height = `${percentage}%`;
    }
  }, { passive: true });
}

/**
 * 6. SCROLL PROGRESS BAR
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercentage}%`;
  }, { passive: true });
}

/**
 * 7. BACK TO TOP BUTTON
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 8. IMAGE FALLBACK HANDLER
 */
function initImageFallback() {
  const portraitImages = document.querySelectorAll('.profile-portrait-img');
  portraitImages.forEach((img) => {
    img.addEventListener('error', () => {
      // Fallback to local asset if available, or generate a high-contrast dental portrait placeholder
      if (!img.src.includes('assets/marliya-sultan.jpg')) {
        img.src = 'assets/marliya-sultan.jpg';
      }
    });
  });
}
