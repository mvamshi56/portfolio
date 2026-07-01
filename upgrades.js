/**
 * PORTFOLIO UPGRADES 2026 - NON-DISRUPTIVE ENHANCEMENTS
 * Adds features without modifying existing functionality
 */

(function() {
  'use strict';

  /* ════════════════════════════════════════════════════════
     1. DARK/LIGHT MODE TOGGLE
     ════════════════════════════════════════════════════════ */
  function initThemeToggle() {
    // Check saved preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Create toggle button
    const toggle = document.createElement('div');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-label', 'Toggle theme');
    toggle.setAttribute('tabindex', '0');
    
    const updateToggle = (theme) => {
      const icon = theme === 'dark' ? '🌙' : '☀️';
      const text = theme === 'dark' ? 'Dark' : 'Light';
      toggle.innerHTML = `
        <span class="theme-toggle-icon">${icon}</span>
        <span class="theme-toggle-text">${text}</span>
      `;
    };
    
    updateToggle(currentTheme);
    
    const toggleTheme = () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggle(newTheme);
      showToast('Theme updated', `Switched to ${newTheme} mode`, 'success');
    };
    
    toggle.addEventListener('click', toggleTheme);
    toggle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
    
    document.body.appendChild(toggle);
  }

  /* ════════════════════════════════════════════════════════
     2. LAZY LOADING IMAGES WITH FADE-IN
     ════════════════════════════════════════════════════════ */
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
            // If already loaded (from cache)
            if (img.complete) {
              img.classList.add('loaded');
            }
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => img.classList.add('loaded'));
    }
  }

  /* ════════════════════════════════════════════════════════
     3. SCROLL REVEAL ANIMATIONS
     ════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .stagger-container'
    );
    
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback: reveal all immediately
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  }

  /* ════════════════════════════════════════════════════════
     4. LIVE GITHUB METRICS - REMOVED (Already implemented in enhancements.js)
     ════════════════════════════════════════════════════════ */
  // GitHub metrics are already perfectly implemented in your existing code.
  // No need to duplicate this functionality.

  /* ════════════════════════════════════════════════════════
     5. TOAST NOTIFICATIONS
     ════════════════════════════════════════════════════════ */
  let toastContainer = null;
  
  function initToastContainer() {
    if (toastContainer) return;
    
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'region');
    toastContainer.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(toastContainer);
  }
  
  function showToast(title, message, type = 'info', duration = 3000) {
    initToastContainer();
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="${icons[type]} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  // Expose globally for other scripts
  window.showToast = showToast;

  /* ════════════════════════════════════════════════════════
     6. SKIP TO CONTENT LINK
     ════════════════════════════════════════════════════════ */
  function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if not present
    const mainContent = document.querySelector('main, [role="main"]') || 
                       document.querySelector('section');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  /* ════════════════════════════════════════════════════════
     7. ENHANCED IMAGE OPTIMIZATION
     ════════════════════════════════════════════════════════ */
  function optimizeImages() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      // Add lazy loading to images not in viewport
      const rect = img.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add alt text if missing
      if (!img.alt && img.src) {
        const filename = img.src.split('/').pop().split('.')[0];
        img.alt = filename.replace(/[-_]/g, ' ');
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     8. PERFORMANCE MONITORING
     ════════════════════════════════════════════════════════ */
  function logPerformanceMetrics() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Log page load time
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('📊 Performance Metrics:');
            console.log(`  DOM Load: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
            console.log(`  Full Load: ${Math.round(perfData.loadEventEnd)}ms`);
            console.log(`  First Paint: ${Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)}ms`);
          }
        }, 0);
      });
    }
  }

  /* ════════════════════════════════════════════════════════
     9. SMOOTH SCROLL BEHAVIOR
     ════════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without page jump
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     10. KEYBOARD NAVIGATION ENHANCEMENT
     ════════════════════════════════════════════════════════ */
  function enhanceKeyboardNav() {
    // Add visible focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  /* ════════════════════════════════════════════════════════
     11. STRUCTURED DATA VALIDATION
     ════════════════════════════════════════════════════════ */
  function validateStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        JSON.parse(script.textContent);
        console.log('✅ Valid structured data found');
      } catch (e) {
        console.error('❌ Invalid structured data:', e);
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     INITIALIZATION
     ════════════════════════════════════════════════════════ */
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    console.log('🚀 Portfolio Upgrades 2026 - Initializing...');
    
    // Initialize all features
    initThemeToggle();
    addSkipLink();
    initLazyLoading();
    initScrollReveal();
    optimizeImages();
    initSmoothScroll();
    enhanceKeyboardNav();
    logPerformanceMetrics();
    validateStructuredData();
    
    // GitHub metrics already implemented in enhancements.js
    // No need to fetch again
    
    console.log('✅ Portfolio Upgrades 2026 - Ready!');
    
    // Show welcome toast (optional - can be disabled)
    setTimeout(() => {
      showToast(
        'Enhanced Portfolio',
        'Dark mode toggle and accessibility improvements active!',
        'info',
        4000
      );
    }, 1000);
  }
  
  // Start initialization
  init();
  
})();
