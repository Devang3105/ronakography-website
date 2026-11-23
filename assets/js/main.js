(() => {
  const config = window.SITE_CONFIG || {};
  const items = Array.isArray(window.PORTFOLIO_ITEMS) ? window.PORTFOLIO_ITEMS : [];
  const grid = document.getElementById('video-grid');
  const emptyState = document.getElementById('empty-state');
  const galleryCount = document.getElementById('gallery-count');
  const filters = [...document.querySelectorAll('.filter-pill')];
  const modal = document.getElementById('media-modal');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalCounter = document.getElementById('modal-counter');
  const prevBtn = document.getElementById('modal-prev');
  const nextBtn = document.getElementById('modal-next');

  let currentFilter = 'all';
  let lastFocused = null;
  let activeIndex = 0;
  let currentVisibleItems = [];

  // Contact & phone setup
  const phone = (config.phoneNumber || '+918160610973').replace(/[^+\d]/g, '');
  const whatsapp = (config.whatsappNumber || phone.replace(/\D/g, '')).replace(/\D/g, '');
  const phoneDisplay = config.phoneDisplay || phone;
  const waMessage = encodeURIComponent(`Hi ${config.photographerName || 'Ronak'}, I would like to enquire about a photography / wedding shoot.`);

  const phoneDisplayEl = document.getElementById('phone-display');
  if (phoneDisplayEl) phoneDisplayEl.textContent = phoneDisplay;
  const callContactEl = document.getElementById('call-contact');
  if (callContactEl) callContactEl.href = `tel:${phone}`;
  const whatsappContactEl = document.getElementById('whatsapp-contact');
  if (whatsappContactEl) whatsappContactEl.href = `https://wa.me/${whatsapp}?text=${waMessage}`;
  const whatsappHeroEl = document.getElementById('whatsapp-hero');
  if (whatsappHeroEl) whatsappHeroEl.href = `https://wa.me/${whatsapp}?text=${waMessage}`;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Instagram integration
  const instagram = (config.instagramUsername || '').trim().replace(/^@/, '');
  const instagramLink = document.getElementById('instagram-contact');
  const instagramDisplay = document.getElementById('instagram-display');
  if (instagram && instagramLink && instagramDisplay) {
    instagramDisplay.textContent = `@${instagram}`;
    instagramLink.href = `https://www.instagram.com/${encodeURIComponent(instagram)}/`;
    instagramLink.target = '_blank';
    instagramLink.rel = 'noopener noreferrer';
    instagramLink.classList.remove('is-pending');
    instagramLink.removeAttribute('aria-disabled');
    instagramLink.removeAttribute('title');
  } else if (instagramLink) {
    instagramLink.addEventListener('click', (event) => event.preventDefault());
  }

  // High-visibility professional logo mounting
  const logoSlot = document.getElementById('logo-slot');
  if (config.logoPath && logoSlot) {
    const logo = document.createElement('img');
    logo.src = config.logoPath;
    logo.alt = `${config.brandName || 'RONAKOGRAPHY'} — Ronak Motirai`;
    logo.className = 'site-brand-logo';
    logo.onerror = () => {
      logoSlot.innerHTML = `<span class="logo-placeholder"><span class="logo-plus">+</span><span>${escapeHtml(config.brandName || 'RONAKOGRAPHY')}</span></span>`;
    };
    logoSlot.replaceChildren(logo);
    document.querySelector('.brand-lockup')?.classList.add('has-custom-logo');
  }

  // Footer logo mounting
  const footerLogo = document.getElementById('footer-logo-wrap');
  if (footerLogo && config.logoPath) {
    const fLogo = document.createElement('img');
    fLogo.src = config.logoPath;
    fLogo.alt = `${config.brandName || 'RONAKOGRAPHY'} logo`;
    fLogo.className = 'footer-logo-img';
    fLogo.onerror = () => { fLogo.remove(); };
    footerLogo.appendChild(fLogo);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function makeCard(item, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'video-card';
    card.dataset.category = item.category || 'wedding';
    card.dataset.index = index;
    card.setAttribute('aria-label', `View ${item.title || `project ${index + 1}`}`);

    const art = document.createElement('div');
    art.className = `card-art art-${(index % 6) + 1}`;
    if (item.thumbnail || item.image) {
      const image = document.createElement('img');
      image.src = item.thumbnail || item.image;
      image.alt = item.title || `Photograph ${index + 1}`;
      image.loading = 'lazy';
      image.onerror = () => {
        image.remove();
        art.classList.remove('has-image');
      };
      art.classList.add('has-image');
      art.appendChild(image);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-copy';
      placeholder.innerHTML = '<span class="placeholder-mark">+</span><small>IMAGE COMING SOON</small>';
      art.appendChild(placeholder);
    }

    const indexLabel = document.createElement('span');
    indexLabel.className = 'card-index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');

    const overlay = document.createElement('span');
    overlay.className = 'play-overlay';
    const isVideo = Boolean(item.video || item.youtubeId || item.videoUrl);
    if (isVideo) {
      overlay.innerHTML = '<span class="play-btn-circle" title="Play Video"><svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span>';
    } else {
      overlay.innerHTML = '<span class="play-btn-circle view-btn-circle" title="View Full Photo"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>';
    }

    const caption = document.createElement('span');
    caption.className = 'card-caption-overlay';
    caption.innerHTML = `<span class="card-tag">${escapeHtml(item.tag || 'SELECTED WORK')}</span><span class="card-title">${escapeHtml(item.title || `Project ${index + 1}`)}</span>`;

    card.append(art, indexLabel, overlay, caption);
    card.addEventListener('click', () => openMediaByItem(item, card));
    return card;
  }

  // Populate gallery
  items.forEach((item, index) => grid.appendChild(makeCard(item, index)));

  // Update dynamic count tags
  filters.forEach((button) => {
    const f = button.dataset.filter;
    const countEl = button.querySelector('.filter-count');
    if (countEl) {
      const count = f === 'all' ? items.length : items.filter((it) => it.category === f).length;
      countEl.textContent = count;
    }
  });

  function updateFilter(filter) {
    currentFilter = filter;
    let visible = 0;
    currentVisibleItems = [];

    [...grid.children].forEach((card) => {
      const idx = parseInt(card.dataset.index, 10);
      const item = items[idx];
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) {
        visible++;
        currentVisibleItems.push({ item, card, index: idx });
      }
    });

    filters.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (galleryCount) {
      galleryCount.textContent = `${visible} ${visible === 1 ? 'WORK' : 'WORKS'}`;
    }
    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  filters.forEach((button) => button.addEventListener('click', () => updateFilter(button.dataset.filter)));
  updateFilter('all');

  function openMediaByItem(item, trigger) {
    const visIndex = currentVisibleItems.findIndex((e) => e.item === item);
    activeIndex = visIndex >= 0 ? visIndex : 0;
    renderModalMedia(item, trigger);
  }

  function renderModalMedia(item, trigger) {
    lastFocused = trigger || lastFocused;
    modalTitle.textContent = item.title || 'SELECTED WORK';
    if (modalMeta) {
      modalMeta.textContent = `${item.tag || 'PHOTOGRAPHY'} · RONAK MOTIRAI`;
    }
    if (modalCounter) {
      const total = currentVisibleItems.length;
      const current = activeIndex + 1;
      modalCounter.textContent = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    modalMedia.replaceChildren();

    if (item.video) {
      const video = document.createElement('video');
      video.src = item.video;
      if (item.thumbnail) video.poster = item.thumbnail;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'metadata';
      modalMedia.appendChild(video);
    } else if (item.youtubeId) {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtubeId)}?autoplay=1&rel=0&playsinline=1`;
      frame.title = item.title || 'Portfolio video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      modalMedia.appendChild(frame);
    } else if (item.image || item.thumbnail) {
      const image = document.createElement('img');
      image.src = item.image || item.thumbnail;
      image.alt = item.title || 'Portfolio photograph';
      modalMedia.appendChild(image);
    } else if (item.videoUrl) {
      const video = document.createElement('video');
      video.src = item.videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      modalMedia.appendChild(video);
    } else {
      const message = document.createElement('p');
      message.className = 'modal-empty';
      message.textContent = 'This project slot is ready to be loaded.';
      modalMedia.appendChild(message);
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.modal-close').focus();
  }

  function navigateModal(direction) {
    if (!currentVisibleItems.length) return;
    activeIndex = (activeIndex + direction + currentVisibleItems.length) % currentVisibleItems.length;
    const target = currentVisibleItems[activeIndex];
    renderModalMedia(target.item, target.card);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1));

  function closeModal() {
    if (!modal.classList.contains('is-active')) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalMedia.replaceChildren();
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-active')) return;
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'ArrowLeft') {
      navigateModal(-1);
    } else if (event.key === 'ArrowRight') {
      navigateModal(1);
    }
  });
})();
