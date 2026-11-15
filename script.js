// ==========================================
// TAILWIND CONFIGURATION
// ==========================================
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        obsidian: '#08090c',
        surface: '#0f1219',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  }
};

// ==========================================
// MOTION & SPA INTERACTIVE ENGINE
// ==========================================
function initPortfolioApp() {
  // 0. Initialize Ultra-Slow & Buttery-Smooth Lenis Inertial Scroll Engine
  let lenis = null;
  const smoothContentWrapper = document.getElementById('smooth-content-wrapper');
  let currentSkew = 0;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.045,          // Low lerp = heavy, ultra-slow, luxurious momentum
      wheelMultiplier: 0.72, // Slows down wheel jumps for cinematic pacing
      touchMultiplier: 1.2,
      smoothWheel: true,
      smoothTouch: false
    });

    lenis.on('scroll', (e) => {
      // Update top progress bar
      const scrollBar = document.getElementById('scroll-bar');
      if (scrollBar) {
        scrollBar.style.width = (e.progress * 100) + '%';
      }
      // Subtle 3D velocity skew on scroll
      const targetSkew = Math.max(-2.2, Math.min(2.2, e.velocity * 0.06));
      currentSkew += (targetSkew - currentSkew) * 0.15;
      if (smoothContentWrapper && Math.abs(currentSkew) > 0.01) {
        smoothContentWrapper.style.transform = `perspective(1400px) skewY(${currentSkew.toFixed(2)}deg)`;
      } else if (smoothContentWrapper) {
        smoothContentWrapper.style.transform = 'none';
      }

      // Update active navbar section while scrolling
      handleScrollSpy();
    });
  }

  // 1. Preloader Counter & Split Curtain Sequence
  const percentEl = document.getElementById('preloader-percent');
  const barEl = document.getElementById('preloader-bar');
  const replayBtn = document.getElementById('replay-intro-btn');
  let introInterval = null;

  function runIntroSequence() {
    document.body.classList.remove('intro-complete');
    let progress = 0;
    clearInterval(introInterval);

    introInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 9) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(introInterval);
        setTimeout(() => {
          document.body.classList.add('intro-complete');
        }, 220);
      }
      if (percentEl) percentEl.textContent = progress + '%';
      if (barEl) barEl.style.width = progress + '%';
    }, 32);
  }

  // Start intro sequence on load or immediately if already loaded
  if (document.readyState === 'complete') {
    runIntroSequence();
  } else {
    window.addEventListener('load', runIntroSequence);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 2.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      runIntroSequence();
    });
  }

  // 2. Lerped Dual Magnetic Cursor + Spotlight + Particle Canvas
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorText = document.getElementById('cursor-text');
  const spotlight = document.getElementById('mouse-spotlight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    hasMoved = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorDot.style.opacity = '1';
    }
    if (cursorRing) {
      cursorRing.style.opacity = '1';
    }
    if (spotlight) {
      spotlight.style.background = `radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.13), rgba(34, 211, 238, 0.05) 40%, transparent 70%)`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (hasMoved) {
      if (cursorDot) cursorDot.style.opacity = '1';
      if (cursorRing) cursorRing.style.opacity = '1';
    }
  });

  // Hover states for custom cursor
  if (cursorRing && cursorText) {
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const label = el.getAttribute('data-cursor');
        cursorRing.style.width = '72px';
        cursorRing.style.height = '72px';
        cursorRing.style.marginLeft = '-36px';
        cursorRing.style.marginTop = '-36px';
        cursorRing.style.backgroundColor = 'rgba(255, 255, 255, 0.94)';
        cursorRing.style.borderColor = 'transparent';
        cursorText.textContent = label;
        cursorText.style.opacity = '1';
        cursorText.style.transform = 'scale(1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
        cursorRing.style.marginLeft = '-20px';
        cursorRing.style.marginTop = '-20px';
        cursorRing.style.backgroundColor = 'transparent';
        cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.35)';
        cursorText.style.opacity = '0';
        cursorText.style.transform = 'scale(0.5)';
      });
    });
  }

  // Magnetic button pull
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate3d(${dx * 0.28}px, ${dy * 0.28}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0px, 0px, 0px)';
    });
  });

  // 3. Universal 3D Perspective Tilt + Specular Glare Engine on ALL [data-tilt] Divs
  let globalTiltMultiplier = 1;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    // Inject dynamic specular glare layer into every 3D div
    const glare = document.createElement('div');
    glare.className = 'glare-layer';
    card.appendChild(glare);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const normX = relX / rect.width - 0.5;
      const normY = relY / rect.height - 0.5;

      const baseMax = parseFloat(card.getAttribute('data-tilt-max') || '16');
      const maxDeg = baseMax * globalTiltMultiplier;

      const rotY = (normX * maxDeg * 1.4).toFixed(2);
      const rotX = (-normY * maxDeg * 1.4).toFixed(2);

      card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(14px) scale3d(1.018, 1.018, 1.018)`;
      glare.style.background = `radial-gradient(420px circle at ${relX}px ${relY}px, rgba(255, 255, 255, 0.16), rgba(34, 211, 238, 0.06) 35%, transparent 70%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
    });
  });

  // 4. Interactive Particle Network Canvas + Master RAF Loop
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particleCount = Math.min(58, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        radius: Math.random() * 1.7 + 0.7
      });
    }

    function animateLoop(time) {
      if (lenis) {
        lenis.raf(time);
      }

      // Lerp cursor ring
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Draw particle mesh
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129, 140, 248, 0.48)';
        ctx.fill();

        const dxMouse = p.x - ringX;
        const dyMouse = p.y - ringY;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 165) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(ringX, ringY);
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - distMouse / 165) * 0.26})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 130) * 0.15})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateLoop);
    }
    requestAnimationFrame(animateLoop);
  }

  // 5. Typewriter Role Rotator
  const roles = [
    'Software Engineering Student',
    'Video Editor'
  ];
  const roleEl = document.getElementById('role-typewriter');
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tickTypewriter() {
    if (!roleEl) return;
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tickTypewriter, 1900);
        return;
      }
      setTimeout(tickTypewriter, 55);
    } else {
      charIdx--;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tickTypewriter, 260);
        return;
      }
      setTimeout(tickTypewriter, 28);
    }
  }
  if (roleEl) {
    setTimeout(tickTypewriter, 1800);
  }

  // 6. Section Scroll Spy & Smooth Hash Navigation
  const navSections = ['home', 'about', 'skills', 'portfolio', 'contact'];
  const navLinks = document.querySelectorAll('[data-nav]');
  const routeStatusPill = document.getElementById('route-status-pill');
  let currentActiveSection = 'home';
  let isClickScrolling = false;
  let clickScrollTimer = null;

  function setActiveNavLink(sectionId, updateHash = false) {
    if (currentActiveSection === sectionId) return;
    currentActiveSection = sectionId;

    const hashStr = '#' + sectionId;
    if (updateHash) {
      history.replaceState(null, '', hashStr);
    }
    if (routeStatusPill) {
      routeStatusPill.textContent = sectionId.toUpperCase();
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.getAttribute('data-nav') === sectionId) {
        link.classList.add('bg-white/10', 'text-white');
        link.classList.remove('text-gray-400');
      } else {
        link.classList.remove('bg-white/10', 'text-white');
        link.classList.add('text-gray-400');
      }
    });
  }

  function handleScrollSpy() {
    if (isClickScrolling) return;

    // Check if scrolled near the bottom of the page
    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollBottom >= documentHeight - 120) {
      setActiveNavLink('contact', true);
      return;
    }

    // Measure viewport position of each section
    const triggerThreshold = window.innerHeight * 0.38;
    let activeId = 'home';

    for (let i = 0; i < navSections.length; i++) {
      const secEl = document.getElementById(navSections[i]);
      if (secEl) {
        const rect = secEl.getBoundingClientRect();
        if (rect.top <= triggerThreshold) {
          activeId = navSections[i];
        }
      }
    }

    setActiveNavLink(activeId, true);
  }

  function navigateToSection(sectionId, updateHash = true) {
    const target = document.getElementById(sectionId);
    if (target) {
      isClickScrolling = true;
      clearTimeout(clickScrollTimer);
      setActiveNavLink(sectionId, updateHash);

      if (lenis) {
        lenis.scrollTo(target, {
          offset: -40,
          duration: 1.8,
          onComplete: () => {
            isClickScrolling = false;
          }
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      clickScrollTimer = setTimeout(() => {
        isClickScrolling = false;
      }, 2000);
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute('data-nav');
      if (targetSection) {
        navigateToSection(targetSection, true);
      }
    });
  });

  // Listen to native scroll as well
  window.addEventListener('scroll', handleScrollSpy, { passive: true });

  // Initial check on load
  handleScrollSpy();

  // Reversible Slow Pop-Up Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // Re-arm animation when scrolled out of view so it pops up slowly again
        entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-item').forEach((el) => observer.observe(el));


  // 8. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach((b) => {
        b.classList.remove('bg-indigo-500', 'text-white');
        b.classList.add('text-gray-400');
      });
      btn.classList.add('bg-indigo-500', 'text-white');
      btn.classList.remove('text-gray-400');

      projectItems.forEach((card) => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 9. Copy Email & Contact Drawer Modal
  const copyEmailBtn = document.getElementById('copy-email-hero');
  const copyEmailLabel = document.getElementById('copy-email-label');
  if (copyEmailBtn && copyEmailLabel) {
    const userEmail = 'kottiismail501@gmail.com';
    copyEmailBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(userEmail).catch(() => {});
      }
      const tempInput = document.createElement('input');
      tempInput.value = userEmail;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      copyEmailLabel.textContent = '✓ Copied to clipboard!';
      setTimeout(() => {
        copyEmailLabel.textContent = userEmail;
      }, 2000);
    });
  }

  const contactModal = document.getElementById('contact-modal');
  const openDrawerBtn = document.getElementById('open-contact-drawer');
  const heroTalkBtn = document.getElementById('hero-talk-btn');
  const closeModalBtn = document.getElementById('close-contact-modal');
  const modalGoForm = document.getElementById('modal-go-form');

  if (contactModal) {
    function openModal() {
      contactModal.classList.remove('hidden');
      contactModal.classList.add('flex');
    }
    function closeModal() {
      contactModal.classList.add('hidden');
      contactModal.classList.remove('flex');
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openModal);
    if (heroTalkBtn) heroTalkBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalGoForm) modalGoForm.addEventListener('click', closeModal);
  }

  // Alert modal helper
  function showAlertModal(title, message) {
    const alertModal = document.getElementById('contact-alert-modal');
    const alertTitle = document.getElementById('contact-alert-title');
    const alertText = document.getElementById('contact-alert-text');
    if (alertModal) {
      if (alertTitle && title) alertTitle.textContent = title;
      if (alertText && message) alertText.textContent = message;
      alertModal.classList.remove('hidden');
      alertModal.classList.add('flex');

      if (typeof confetti === 'function') {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.65 }
          });
        } catch (_) {}
      }
    }
  }

  const alertModal = document.getElementById('contact-alert-modal');
  const closeAlertBtn = document.getElementById('close-alert-btn');
  if (alertModal && closeAlertBtn) {
    function closeAlert() {
      alertModal.classList.add('hidden');
      alertModal.classList.remove('flex');
    }
    closeAlertBtn.addEventListener('click', closeAlert);
    alertModal.addEventListener('click', (e) => {
      if (e.target === alertModal) closeAlert();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !alertModal.classList.contains('hidden')) {
        closeAlert();
      }
    });
  }

  // Contact form submission with conditions validation & fallback
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const msgInput = document.getElementById('contact-message');
  const consentInput = document.getElementById('contact-consent');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const msgError = document.getElementById('message-error');
  const consentError = document.getElementById('consent-error');
  const charCounter = document.getElementById('char-counter');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setFieldState(input, errorEl, isValid) {
    if (!input) return;
    if (isValid) {
      input.classList.remove('border-rose-500/80', 'focus:border-rose-500');
      input.classList.add('border-emerald-500/40');
      if (errorEl) errorEl.classList.add('hidden');
    } else {
      input.classList.remove('border-emerald-500/40');
      input.classList.add('border-rose-500/80', 'focus:border-rose-500');
      if (errorEl) errorEl.classList.remove('hidden');
    }
  }

  // Real-time input listeners
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      const valid = nameInput.value.trim().length >= 2;
      setFieldState(nameInput, nameError, valid);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const valid = validateEmail(emailInput.value.trim());
      setFieldState(emailInput, emailError, valid);
    });
  }

  if (msgInput && charCounter) {
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.trim().length;
      charCounter.textContent = `${len} characters`;
      if (len > 0) {
        charCounter.classList.remove('text-gray-500');
        charCounter.classList.add('text-emerald-400');
        setFieldState(msgInput, msgError, true);
      } else {
        charCounter.classList.remove('text-emerald-400');
        charCounter.classList.add('text-gray-500');
      }
    });
  }

  if (consentInput && consentError) {
    consentInput.addEventListener('change', () => {
      if (consentInput.checked) {
        consentError.classList.add('hidden');
      }
    });
  }

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check native browser validity first so user sees native speech bubbles if empty
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';
      const hasConsent = consentInput ? consentInput.checked : true;

      // Validate email format
      const isEmailValid = validateEmail(email);
      setFieldState(emailInput, emailError, isEmailValid);

      if (!isEmailValid) {
        contactForm.classList.add('animate-shake');
        setTimeout(() => contactForm.classList.remove('animate-shake'), 450);
        if (emailInput) emailInput.focus();
        return;
      }

      if (consentError && !hasConsent) {
        consentError.classList.remove('hidden');
        contactForm.classList.add('animate-shake');
        setTimeout(() => contactForm.classList.remove('animate-shake'), 450);
        if (consentInput) consentInput.focus();
        return;
      }

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message →';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-flex items-center gap-2">
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        `;
      }

      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent from Ismail Kotti's Portfolio`);
      const mailtoUrl = `mailto:kottiismail501@gmail.com?subject=${subject}&body=${body}`;
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kottiismail501@gmail.com&su=${subject}&body=${body}`;

      function resetFormFields() {
        contactForm.reset();
        if (charCounter) {
          charCounter.textContent = '0 characters';
          charCounter.classList.remove('text-emerald-400');
          charCounter.classList.add('text-gray-500');
        }
        if (consentInput) consentInput.checked = true;
        [nameInput, emailInput, msgInput].forEach(inp => {
          if (inp) {
            inp.classList.remove('border-emerald-500/40', 'border-rose-500/80');
            inp.classList.add('border-white/10');
          }
        });
      }

      // Always show success alert modal to confirm action to the user
      function displaySuccess(isDirectSend) {
        resetFormFields();
        const alertModal = document.getElementById('contact-alert-modal');
        const alertTitle = document.getElementById('contact-alert-title');
        const alertText = document.getElementById('contact-alert-text');
        if (alertModal) {
          if (alertTitle) alertTitle.textContent = isDirectSend ? 'Message Sent Successfully!' : 'Message Ready to Send!';
          if (alertText) {
            alertText.innerHTML = isDirectSend 
              ? `Thank you <span class="text-white font-semibold">${name || 'there'}</span>! Your message has been sent to Ismail Kotti. I'll get back to you within 24 hours.`
              : `Thank you <span class="text-white font-semibold">${name || 'there'}</span>! Your message has been prepared for Ismail Kotti (<span class="text-cyan-300">kottiismail501@gmail.com</span>).<br><br><a href="${gmailWebUrl}" target="_blank" class="inline-flex items-center gap-1 text-cyan-400 hover:text-white underline font-semibold mt-2">Open &amp; Send in Gmail Web ↗</a>`;
          }
          alertModal.classList.remove('hidden');
          alertModal.classList.add('flex');

          if (typeof confetti === 'function') {
            try {
              confetti({ particleCount: 75, spread: 60, origin: { y: 0.65 } });
            } catch (_) {}
          }
        }
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/kottiismail501@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `New Portfolio Message from ${name}`
          })
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success !== 'false' && data.success !== false) {
          displaySuccess(true);
        } else {
          displaySuccess(false);
        }
      } catch (err) {
        displaySuccess(false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
}

// Ensure DOM is ready before executing UI/motion code
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioApp);
} else {
  initPortfolioApp();
}

