/* ============================================
   NANDU PS — Portfolio JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === Cursor Glow Effect ===
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // === Navbar Scroll Effect ===
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // === Mobile Navigation Toggle ===
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // === Animated Counter ===
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersAnimated = true;
      statNumbers.forEach((num) => {
        const target = parseInt(num.getAttribute('data-target'));
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            num.textContent = target;
            clearInterval(timer);
          } else {
            num.textContent = Math.floor(current);
          }
        }, 40);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // Check on load

  // === Skill Bar Animation ===
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      skillsAnimated = true;
      skillBars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, index * 200);
      });
    }
  }

  window.addEventListener('scroll', animateSkillBars, { passive: true });

  // === Scroll Reveal Animation ===
  const revealElements = document.querySelectorAll(
    '.section-header, .about-text, .about-visual, .skill-card, .gallery-item, .contact-card, .contact-form, .video-showcase, .video-card'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // === Portfolio Filter ===
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.5s var(--ease-out) forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // === Lightbox ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentImageIndex = 0;
  let galleryImages = [];

  function updateGalleryImages() {
    galleryImages = [];
    document.querySelectorAll('.gallery-item:not(.hidden) .gallery-image-wrapper').forEach((wrapper) => {
      const img = wrapper.querySelector('img');
      galleryImages.push({
        src: img.src,
        alt: img.alt,
        title: wrapper.querySelector('.gallery-info h3')?.textContent || '',
        subtitle: wrapper.querySelector('.gallery-info p')?.textContent || '',
      });
    });
  }

  function openLightbox(index) {
    updateGalleryImages();
    currentImageIndex = index;
    showLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showLightboxImage() {
    if (!galleryImages[currentImageIndex]) return;
    const data = galleryImages[currentImageIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = `${data.title} — ${data.subtitle}`;
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showLightboxImage();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage();
  }

  // Attach click events to gallery items
  document.querySelectorAll('.gallery-image-wrapper').forEach((wrapper) => {
    wrapper.addEventListener('click', () => {
      updateGalleryImages();
      const visibleWrappers = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) .gallery-image-wrapper'));
      const activeIdx = visibleWrappers.indexOf(wrapper);
      if (activeIdx !== -1) {
        currentImageIndex = activeIdx;
        showLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // === Contact Form ===
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-primary');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = `
      <span>Message Sent!</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    `;
    btn.style.background = 'linear-gradient(135deg, #00cec9, #55efc4)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  // === Smooth Scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
