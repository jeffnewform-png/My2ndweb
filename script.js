/* Discover England - Javascript Logics */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==================== 1. Loader Overlay Dismissal ====================
  const loaderOverlay = document.getElementById('loader-overlay');
  
  // Hide loading screen when page is fully loaded
  window.addEventListener('load', () => {
    if (loaderOverlay) {
      loaderOverlay.classList.add('fade-out');
      // Set aria-hidden to true after fadeout
      setTimeout(() => {
        loaderOverlay.style.display = 'none';
      }, 500);
    }
  });

  // Fallback in case window load takes too long (e.g. slow network asset)
  setTimeout(() => {
    if (loaderOverlay && !loaderOverlay.classList.contains('fade-out')) {
      loaderOverlay.classList.add('fade-out');
      setTimeout(() => {
        loaderOverlay.style.display = 'none';
      }, 500);
    }
  }, 3000);


  // ==================== 2. Sticky Navigation Bar Scroll Effect ====================
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ==================== 3. Mobile Navigation Menu Toggle ====================
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      // Accessibility attributes
      const isActive = navLinksContainer.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when navigation links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ==================== 4. Scrollspy (Highlight Menu Links on Scroll) ====================
  const sections = document.querySelectorAll('section');
  
  const scrollspy = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Nav height offset
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', scrollspy);
  window.addEventListener('load', scrollspy);


  // ==================== 5. Dynamic Web Audio Chime (Bonus Feature) ====================
  let audioCtx = null;

  // Synthesize a brief premium chime sound on hover/click using Web Audio API
  const playSynthesisSound = (freq1, freq2, duration, volume) => {
    try {
      // Lazy init AudioContext on user action
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
      
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Silently catch browser restriction blocks on audio context auto-play
    }
  };

  const initButtonSounds = () => {
    const elementsToSound = document.querySelectorAll('.btn, .nav-link, .gallery-card, .landmark-card, .culture-card, .scroll-to-top');
    
    elementsToSound.forEach(el => {
      // Subtle slide up sound on mouse enter
      el.addEventListener('mouseenter', () => {
        playSynthesisSound(600, 800, 0.08, 0.012);
      });
      // Bright double click chime on select
      el.addEventListener('click', () => {
        playSynthesisSound(700, 1100, 0.12, 0.03);
      });
    });
  };

  initButtonSounds();


  // ==================== 6. Fun Fact Modal Requirement ====================
  const modal = document.getElementById('fact-modal');
  const openModalBtn = document.getElementById('open-fact-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (modal && openModalBtn && closeModalBtn) {
    const openModal = () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock background scroll
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on click outside modal container
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close modal on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }


  // ==================== 7. Scroll-to-Top Button ====================
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==================== 8. Contact Form Validation & Animation ====================
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('submit-success');
  const resetFormBtn = document.getElementById('reset-form-btn');

  // Input Elements
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Error Messages
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form && successOverlay) {
    
    // Validate individual inputs
    const validateField = (input, errorEl, condition) => {
      if (condition) {
        input.classList.remove('invalid');
        errorEl.style.display = 'none';
        return true;
      } else {
        input.classList.add('invalid');
        errorEl.style.display = 'block';
        return false;
      }
    };

    // Live validations on typing/focusout
    nameInput.addEventListener('input', () => {
      validateField(nameInput, nameError, nameInput.value.trim() !== '');
    });
    
    emailInput.addEventListener('input', () => {
      validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
    });

    messageInput.addEventListener('input', () => {
      validateField(messageInput, messageError, messageInput.value.trim() !== '');
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Perform validation checks
      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim() !== '');
      const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
      const isMsgValid = validateField(messageInput, messageError, messageInput.value.trim() !== '');

      if (isNameValid && isEmailValid && isMsgValid) {
        // Trigger double-chime success sound
        playSynthesisSound(500, 1000, 0.25, 0.05);
        setTimeout(() => {
          playSynthesisSound(800, 1500, 0.35, 0.05);
        }, 120);

        // Display Success overlay
        successOverlay.classList.add('active');
        form.reset(); // Clear form values
      } else {
        // Shaker chime for error state alert
        playSynthesisSound(150, 100, 0.15, 0.05);
      }
    });

    // Reset Form Success State
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
      });
    }
  }

});
