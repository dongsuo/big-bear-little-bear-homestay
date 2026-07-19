import './style.css';

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
const lightboxClose = lightbox
  ? lightbox.querySelector('.lightbox-close')
  : null;

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) {
    lightboxImg.src = '';
    lightboxImg.alt = '';
  }
}

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.hidden = false;
}

document.querySelectorAll('.gallery-item img').forEach((img) => {
  img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

// ===== Room Carousels =====
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const imgs = track ? Array.from(track.querySelectorAll('img')) : [];
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  if (!track || imgs.length === 0) return;

  const count = imgs.length;

  // Clone first slide at the end for seamless loop
  const clone = imgs[0].cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);

  let index = 0;
  let autoTimer = null;
  let isTransitioning = false;

  // Build dots
  if (dotsContainer) {
    imgs.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        restartAuto();
        goTo(i);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (dotsContainer) {
      dotsContainer.querySelectorAll('button').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }
  }

  function goTo(i, animate = true) {
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    track.style.transform = `translateX(-${i * 100}%)`;
    index = i;
    updateDots();
  }

  function next() {
    if (isTransitioning) return;
    isTransitioning = true;
    index++;
    track.style.transition = '';
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();

    if (index >= count) {
      // After transition to clone, jump back to real first instantly
      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        index = 0;
        updateDots();
        // Force reflow then restore transition
        track.offsetHeight;
        track.style.transition = '';
        isTransitioning = false;
      });
    } else {
      // Reset flag after transition
      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        isTransitioning = false;
      });
    }
  }

  function prev() {
    if (isTransitioning) return;
    isTransitioning = true;
    if (index === 0) {
      // Jump to clone (no animation), then animate to last real slide
      track.style.transition = 'none';
      track.style.transform = `translateX(-${count * 100}%)`;
      track.offsetHeight;
      track.style.transition = '';
      index = count - 1;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    } else {
      index--;
      track.style.transition = '';
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }
    track.addEventListener('transitionend', function onEnd() {
      track.removeEventListener('transitionend', onEnd);
      isTransitioning = false;
    });
  }

  function startAuto() {
    autoTimer = setInterval(next, 4000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  if (nextBtn)
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      restartAuto();
      next();
    });
  if (prevBtn)
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      restartAuto();
      prev();
    });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch / swipe
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    },
    { passive: true },
  );
  track.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) next();
      else if (touchEndX - touchStartX > 40) prev();
      startAuto();
    },
    { passive: true },
  );

  // Click image to open lightbox (only real images, not clone)
  imgs.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Start auto-play
  startAuto();
});

if (lightbox) lightbox.addEventListener('click', closeLightbox);
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
