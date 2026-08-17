/**
 * Marliya Sultan — Junior Dentist Portfolio
 * Pure Vanilla JavaScript (No Frameworks / GitHub Pages Ready)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollProgress();
  initScrollAnimations();
  initCopyActions();
  initImageFallbacks();
  initBackToTop();
});

/* ==========================================================================
   THEME MANAGER (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('marliya-portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButtonAria(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('marliya-portfolio-theme', newTheme);
      updateThemeButtonAria(newTheme);
    });
  }

  // Listen to system theme changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('marliya-portfolio-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeButtonAria(newTheme);
    }
  });
}

function updateThemeButtonAria(theme) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ==========================================================================
   NAVIGATION & ACTIVE SECTION INDICATOR
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('main-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Header Transformation
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  function openMobileMenu() {
    menuToggleBtn?.classList.add('is-active');
    menuToggleBtn?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.classList.add('is-open');
    mobileOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    menuToggleBtn?.classList.remove('is-active');
    menuToggleBtn?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.classList.remove('is-open');
    mobileOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Smooth scroll offset adjustment for links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          closeMobileMenu();
          
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active section detection
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  // If reduced motion is preferred, reveal all immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedElements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   COPY TO CLIPBOARD & TOAST NOTIFICATIONS
   ========================================================================== */
function initCopyActions() {
  const copyLinkedInBtn = document.getElementById('copy-linkedin-btn');
  const copySummaryBtn = document.getElementById('copy-summary-btn');
  const toast = document.getElementById('toast-notice');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyLinkedInBtn) {
    copyLinkedInBtn.addEventListener('click', async () => {
      const linkedInUrl = 'https://www.linkedin.com/in/marliya-sultan-153384219/';
      try {
        await navigator.clipboard.writeText(linkedInUrl);
        showToast('LinkedIn profile link copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = linkedInUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('LinkedIn profile link copied to clipboard!');
      }
    });
  }

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', async () => {
      const summaryText = `Marliya Sultan — Junior Dentist | BDS (2024)\nSeeking Opportunities in UAE (#OpenToWork)\nClinical Skills: Extractions, Root Canal Treatment (RCT), Scaling, Endodontics\nLinkedIn: https://www.linkedin.com/in/marliya-sultan-153384219/`;
      try {
        await navigator.clipboard.writeText(summaryText);
        showToast('Profile summary copied to clipboard!');
      } catch (err) {
        showToast('Profile summary ready to share!');
      }
    });
  }
}

/* ==========================================================================
   IMAGE FALLBACK HANDLER
   ========================================================================== */
function initImageFallbacks() {
  const profileImages = document.querySelectorAll('.hero-portrait-img, .showcase-img');
  const fallbackSrc = 'assets/marliya-sultan.jpg';

  profileImages.forEach(img => {
    img.addEventListener('error', function() {
      if (this.src !== fallbackSrc && !this.src.endsWith(fallbackSrc)) {
        this.src = fallbackSrc;
      }
    });
  });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
