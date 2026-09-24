document.addEventListener('DOMContentLoaded', () => {
  // --- Navbar Sticky Effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Drawer Toggle ---
  const btnToggleDrawer = document.querySelectorAll('.btn-toggle-drawer');
  const navDrawer = document.getElementById('navDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  const toggleDrawer = () => {
    if (navDrawer && drawerOverlay) {
      navDrawer.classList.toggle('open');
      drawerOverlay.classList.toggle('open');
    }
  };

  btnToggleDrawer.forEach(btn => {
    btn.addEventListener('click', toggleDrawer);
  });
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', toggleDrawer);
  }

  // --- Theme Toggle ---
  // Note: Auth pages shouldn't have the toggle buttons. 
  const themeToggles = document.querySelectorAll('.btn-theme-toggle');
  
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Update icons
    themeToggles.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = '<i class="ph ph-sun"></i>';
      } else {
        btn.innerHTML = '<i class="ph ph-moon"></i>';
      }
    });
  };

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  // --- RTL Toggle ---
  const rtlToggles = document.querySelectorAll('.btn-rtl-toggle');
  
  const setRTL = (isRTL) => {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem('rtl', 'true');
    } else {
      document.documentElement.removeAttribute('dir');
      localStorage.setItem('rtl', 'false');
    }
  };

  const storedRTL = localStorage.getItem('rtl');
  if (storedRTL === 'true') {
    setRTL(true);
  }

  rtlToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
      setRTL(!isRTL);
    });
  });

  // --- GSAP Animations ---
  if (typeof gsap !== 'undefined') {
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    if (hasScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero animations
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const heroActions = document.querySelector('.hero-actions');

    if (heroTitle) {
      gsap.fromTo(heroTitle, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    }
    if (heroText) {
      gsap.fromTo(heroText, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.25 });
    }
    if (heroActions) {
      gsap.fromTo(heroActions, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.4 });
    }

    // Scroll stagger animations for cards per grid
    const cardGrids = gsap.utils.toArray('.card-grid');
    cardGrids.forEach(grid => {
      const gridCards = grid.querySelectorAll('.card, .blog-card');
      if (gridCards.length > 0) {
        gsap.fromTo(gridCards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: hasScrollTrigger ? {
              trigger: grid,
              start: 'top 92%',
              once: true
            } : null
          }
        );
      }
    });

    // Section Headers
    const sectionHeaders = gsap.utils.toArray('.section-header');
    sectionHeaders.forEach(header => {
      gsap.fromTo(header,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: hasScrollTrigger ? {
            trigger: header,
            start: 'top 90%',
            once: true
          } : null
        }
      );
    });

    // Generic fade-up elements
    const fadeUpElements = gsap.utils.toArray('.fade-up');
    fadeUpElements.forEach(el => {
      // Avoid double animating if nested inside another .fade-up or card grids
      if (el.closest('.card-grid') || el.closest('.project-grid') || el.closest('.species-grid') || el.closest('.pricing-grid') || el.closest('.team-grid')) {
        return;
      }
      if (el.parentElement && el.parentElement.closest('.fade-up')) {
        return;
      }
      
      gsap.fromTo(el,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: hasScrollTrigger ? {
            trigger: el,
            start: 'top 95%',
            once: true
          } : null
        }
      );
    });

    // Parallax background
    const parallaxBgs = gsap.utils.toArray('.parallax-bg');
    parallaxBgs.forEach(bg => {
      gsap.to(bg, {
        backgroundPosition: `50% 100%`,
        ease: "none",
        scrollTrigger: hasScrollTrigger ? {
          trigger: bg,
          start: "top bottom", 
          end: "bottom top",
          scrub: true
        } : null
      });
    });

    // Refresh ScrollTrigger after full page assets and images load
    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // --- Form Validation ---
  const forms = document.querySelectorAll('form');
  
  const showError = (input, message) => {
    const group = input.closest('.form-group');
    if(!group) return;
    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    input.classList.add('is-invalid');
  };

  const clearError = (input) => {
    input.classList.remove('is-invalid');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  forms.forEach(form => {
    // Avoid validation if no-validate is custom
    if(form.classList.contains('no-custom-validate')) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        clearError(input);
        
        if (!input.value.trim()) {
          showError(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'Please enter a valid email address');
          isValid = false;
        } else if (input.type === 'password' && input.value.length < 8) {
          showError(input, 'Password must be at least 8 characters');
          isValid = false;
        }
      });

      // Confirm Password Check
      const password = form.querySelector('input[name="password"]');
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
      }

      // Checkbox terms Check
      const terms = form.querySelector('input[name="terms"]');
      if (terms && !terms.checked) {
        showError(terms, 'You must accept the Terms & Conditions');
        isValid = false;
      }

      if (isValid) {
        // Show inline success message
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> Success';
          submitBtn.classList.add('btn-success');
          submitBtn.style.backgroundColor = 'var(--clr-success)';
          submitBtn.style.color = '#fff';
          
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.color = '';
            form.reset();
          }, 3000);
        }
      }
    });

    // Clear error on input
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if(input.classList.contains('is-invalid')) {
          clearError(input);
        }
      });
    });
  });

  // --- Interactive Carbon & Energy Calculator ---
  const areaSlider = document.getElementById('calcAreaSlider');
  const areaValDisplay = document.getElementById('calcAreaVal');
  const typeSelect = document.getElementById('calcTypeSelect');
  const co2Num = document.getElementById('calcCo2Val');
  const energyNum = document.getElementById('calcEnergyVal');
  const waterNum = document.getElementById('calcWaterVal');
  const rValueNum = document.getElementById('calcRVal');

  if (areaSlider && areaValDisplay && co2Num && energyNum && waterNum) {
    const updateCalculator = () => {
      const area = parseInt(areaSlider.value, 10);
      const mult = typeSelect ? parseFloat(typeSelect.value) : 1.0;
      
      areaValDisplay.textContent = area.toLocaleString() + ' sq ft';
      
      // Carbon sequestered: approx 0.0078 metric tons per sq ft/yr * mult
      const co2 = (area * 0.0078 * mult).toFixed(1);
      // HVAC savings: approx $1.35 per sq ft/yr * mult
      const energy = Math.round(area * 1.35 * mult);
      // Stormwater captured: approx 18.5 gal per sq ft/yr * mult
      const water = Math.round(area * 18.5 * mult);
      // R-Value insulation index
      const rVal = (12.5 * mult).toFixed(1);

      co2Num.textContent = co2;
      energyNum.textContent = '$' + energy.toLocaleString();
      waterNum.textContent = water.toLocaleString() + ' gal';
      if (rValueNum) rValueNum.textContent = 'R-' + rVal;
    };

    areaSlider.addEventListener('input', updateCalculator);
    if (typeSelect) typeSelect.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // --- FAQ Accordions ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close siblings within the same container
        const container = item.closest('.faq-container');
        if (container) {
          container.querySelectorAll('.faq-item').forEach(sibling => {
            sibling.classList.remove('active');
          });
        }
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Project / Case Study Filter Buttons ---
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Blog Category Filter Buttons ---
  const blogFilterBtns = document.querySelectorAll('.filter-btn[data-blog-filter]');
  const blogCards = document.querySelectorAll('.blog-card[data-blog-cat]');

  if (blogFilterBtns.length > 0 && blogCards.length > 0) {
    blogFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-blog-filter');

        blogCards.forEach(card => {
          const category = card.getAttribute('data-blog-cat');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Botanical Species Explorer Tabs ---
  const speciesBtns = document.querySelectorAll('.species-tab-btn[data-species-tab]');
  const speciesCards = document.querySelectorAll('.species-card[data-species-type]');

  if (speciesBtns.length > 0 && speciesCards.length > 0) {
    speciesBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speciesBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-species-tab');

        speciesCards.forEach(card => {
          const cardType = card.getAttribute('data-species-type');
          if (type === 'all' || cardType === type) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Podcast Play Button Mock ---
  const playBtns = document.querySelectorAll('.podcast-play-btn');
  playBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (icon.classList.contains('ph-play')) {
          icon.classList.remove('ph-play');
          icon.classList.add('ph-pause');
        } else {
          icon.classList.remove('ph-pause');
          icon.classList.add('ph-play');
        }
      }
    });
  });

  // --- Quick Quote Instant Estimator (Contact Page) ---
  const quoteType = document.getElementById('quoteType');
  const quoteArea = document.getElementById('quoteArea');
  const quoteOutput = document.getElementById('quoteEstimatedCost');

  if (quoteType && quoteArea && quoteOutput) {
    const calcQuote = () => {
      const typeRate = quoteType.value === 'green-roof' ? 38 : (quoteType.value === 'living-wall' ? 65 : 48);
      const area = parseInt(quoteArea.value, 10) || 500;
      const minCost = Math.round(area * typeRate * 0.9);
      const maxCost = Math.round(area * typeRate * 1.15);
      quoteOutput.textContent = '$' + minCost.toLocaleString() + ' - $' + maxCost.toLocaleString();
    };

    quoteType.addEventListener('change', calcQuote);
    quoteArea.addEventListener('input', calcQuote);
    calcQuote();
  }

});
