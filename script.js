(function () {
  'use strict';

  const cfg = window.SITE_CONFIG || { links: {}, creatorVideos: {} };

  /* ========================================================================
     1. BIND CONFIG LINKS (payment, socials, docs, developer)
     ======================================================================== */
  document.querySelectorAll('[data-config-link]').forEach((el) => {
    const key = el.getAttribute('data-config-link');
    const url = cfg.links && cfg.links[key];
    if (url) {
      el.setAttribute('href', url);
      if (url.startsWith('#')) {
        el.removeAttribute('target');
        el.removeAttribute('rel');
      }
    }
  });

  /* ========================================================================
     2. SMOOTH ANCHOR SCROLLING
     ======================================================================== */
  document.querySelectorAll('.js-scroll').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ========================================================================
     3. AUDIENCE 5-CARD SLIDER (dots + mouse drag support for desktop)
     ======================================================================== */
  const slider = document.getElementById('audienceSlider');
  const dots = Array.from(document.querySelectorAll('#audienceDots .slider-dots__dot'));
  const cards = slider ? Array.from(slider.querySelectorAll('.audience-card')) : [];

  function setActiveDot(idx) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
    });
  }

  if (slider && cards.length) {
    // Update active dot on scroll
    let scrollRaf = null;
    slider.addEventListener('scroll', () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const sliderRect = slider.getBoundingClientRect();
        let bestIdx = 0;
        let bestDist = Infinity;
        cards.forEach((card, idx) => {
          const rect = card.getBoundingClientRect();
          const dist = Math.abs(rect.left - sliderRect.left - 20);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        });
        setActiveDot(bestIdx);
      });
    }, { passive: true });

    // Click dot to scroll card into view
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const card = cards[idx];
        if (!card) return;
        const left = card.offsetLeft - parseFloat(getComputedStyle(slider).paddingLeft || '0');
        slider.scrollTo({ left, behavior: 'smooth' });
        setActiveDot(idx);
      });
    });

    // Desktop click-and-drag support
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      startScrollLeft = slider.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.4;
      slider.scrollLeft = startScrollLeft - walk;
    });
  }

  /* ========================================================================
     4. «THE CREATOR» — 3 INTERACTIVE TABS + SMART VIDEO PLAYER
     ======================================================================== */
  const CREATOR_DATA = {
    trends: {
      headline: 'ОБУЧИЛ БОЛЕЕ 100 УЧЕНИКОВ',
      subtext: 'Помог пройти путь в монтаже более чем 100 людям.',
      caption: 'Учу не просто монтировать, а мыслить как креатор, развивать вкус и превращать навыки в заработок',
      tagLeft: 'ТРЕНДЫ',
      tagRight: '01 / 03',
      progress: '33%',
    },
    creative: {
      headline: 'КРЕАТИВ — МОЯ ОСНОВА',
      subtext: 'Не собираю видео по шаблонам<br />и не гонюсь за каждым трендом.',
      caption: 'Экспериментирую с визуалом, анимацией, нейросетями и ищу решения, которые делают монтаж узнаваемым.',
      tagLeft: 'КРЕАТИВ',
      tagRight: '02 / 03',
      progress: '66%',
    },
    money: {
      headline: 'НАМОНТАЖИЛ НА 5 МЛН РУБЛЕЙ',
      subtext: 'Знаю, как выглядит коммерческий монтаж изнутри и за что заказчики готовы платить.',
      caption: 'Создаю контент для брендов, блогеров и крупных проектов',
      tagLeft: 'ЗАРАБОТОК',
      tagRight: '03 / 03',
      progress: '100%',
    },
  };

  const creatorTabBtns = Array.from(document.querySelectorAll('.creator-tabs__btn'));
  const creatorPhotos = Array.from(document.querySelectorAll('.creator-photo'));
  const creatorHeadline = document.getElementById('creatorHeadline');
  const creatorSubtext = document.getElementById('creatorSubtext');
  const phoneCaption = document.getElementById('phoneCaption');
  const phoneTagLeft = document.getElementById('phoneTagLeft');
  const phoneTagRight = document.getElementById('phoneTagRight');
  const phoneProgressFill = document.getElementById('phoneProgressFill');
  const phoneScreen = document.getElementById('phoneScreen');
  const creatorVideo = document.getElementById('creatorVideo');
  const phoneMuteBtn = document.getElementById('phoneMuteBtn');

  function loadCreatorVideo(tabKey) {
    if (!creatorVideo || !phoneScreen) return;
    const src = cfg.creatorVideos && cfg.creatorVideos[tabKey];
    phoneScreen.classList.remove('has-video');
    if (phoneMuteBtn) phoneMuteBtn.hidden = true;

    if (!src) {
      creatorVideo.removeAttribute('src');
      return;
    }

    creatorVideo.src = src;
    creatorVideo.load();
  }

  if (creatorVideo && phoneScreen) {
    creatorVideo.addEventListener('loadeddata', () => {
      phoneScreen.classList.add('has-video');
      if (phoneMuteBtn) phoneMuteBtn.hidden = false;
      creatorVideo.play().catch(() => {});
    });

    creatorVideo.addEventListener('error', () => {
      phoneScreen.classList.remove('has-video');
      if (phoneMuteBtn) phoneMuteBtn.hidden = true;
    });

    creatorVideo.addEventListener('timeupdate', () => {
      if (creatorVideo.duration && phoneProgressFill) {
        const pct = (creatorVideo.currentTime / creatorVideo.duration) * 100;
        phoneProgressFill.style.width = `${pct.toFixed(1)}%`;
      }
    });

    if (phoneMuteBtn) {
      phoneMuteBtn.addEventListener('click', () => {
        creatorVideo.muted = !creatorVideo.muted;
        phoneMuteBtn.textContent = creatorVideo.muted ? '🔇' : '🔊';
      });
    }
  }

  function switchCreatorTab(tabKey) {
    const info = CREATOR_DATA[tabKey];
    if (!info) return;

    creatorTabBtns.forEach((btn) => {
      const active = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    creatorPhotos.forEach((img) => {
      img.classList.toggle('is-active', img.getAttribute('data-creator-tab') === tabKey);
    });

    if (creatorHeadline) creatorHeadline.textContent = info.headline;
    if (creatorSubtext) creatorSubtext.innerHTML = info.subtext;
    if (phoneCaption) phoneCaption.textContent = info.caption;
    if (phoneTagLeft) phoneTagLeft.textContent = info.tagLeft;
    if (phoneTagRight) phoneTagRight.textContent = info.tagRight;
    if (phoneProgressFill) phoneProgressFill.style.width = info.progress;

    loadCreatorVideo(tabKey);
  }

  creatorTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchCreatorTab(btn.getAttribute('data-tab'));
    });
  });

  // Initialize default active Creator tab («КРЕАТИВ»)
  switchCreatorTab('creative');

  /* ========================================================================
     5. «ПРОГРАММА» — 3 MODULES (tabs + horizontal touch swipe + jump from Offer)
     ======================================================================== */
  const programTabBtns = Array.from(document.querySelectorAll('.program-tabs__btn'));
  const modulePanels = Array.from(document.querySelectorAll('.module-card'));
  const programViewport = document.getElementById('programViewport');
  let activeModuleIdx = 0;

  function switchProgramModule(idx) {
    const total = modulePanels.length;
    if (!total) return;
    activeModuleIdx = ((idx % total) + total) % total;

    programTabBtns.forEach((btn, i) => {
      const active = i === activeModuleIdx;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    modulePanels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === activeModuleIdx);
    });
  }

  programTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchProgramModule(Number(btn.getAttribute('data-module')));
    });
  });

  // Swipe gestures on module card
  if (programViewport) {
    let touchStartX = 0;
    let touchStartY = 0;

    programViewport.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    programViewport.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        switchProgramModule(dx < 0 ? activeModuleIdx + 1 : activeModuleIdx - 1);
      }
    }, { passive: true });
  }

  // Clicking module badges in Offer collage jumps straight to that module in Program
  document.querySelectorAll('.js-jump-module').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-jump-module'));
      switchProgramModule(idx);
      const programEl = document.getElementById('program');
      if (programEl) {
        programEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ========================================================================
     6. LEAD MODAL FORM — «ЗАНЯТЬ МЕСТО» (send.php -> Telegram @montagecore)
     ======================================================================== */
  const leadModal = document.getElementById('leadModal');
  const leadModalClose = document.getElementById('leadModalClose');
  const leadForm = document.getElementById('leadForm');
  const leadSuccess = document.getElementById('leadSuccess');
  const leadSuccessClose = document.getElementById('leadSuccessClose');
  const leadFormError = document.getElementById('leadFormError');
  const leadSubmitBtn = document.getElementById('leadSubmitBtn');
  const leadPlanInput = document.getElementById('leadPlanInput');
  const planToggleBtns = Array.from(document.querySelectorAll('[data-plan-choice]'));

  const nameInput = document.getElementById('leadName');
  const tgInput = document.getElementById('leadTelegram');
  const phoneInput = document.getElementById('leadPhone');
  const checkOffer = document.getElementById('checkOffer');
  const checkMarketing = document.getElementById('checkMarketing');

  function setPlan(planName) {
    if (!planName || !leadPlanInput) return;
    leadPlanInput.value = planName;
    planToggleBtns.forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-plan-choice') === planName);
    });
  }

  function showFormError(msg) {
    if (!leadFormError) return;
    if (!msg) {
      leadFormError.hidden = true;
      leadFormError.textContent = '';
      return;
    }
    leadFormError.textContent = msg;
    leadFormError.hidden = false;
  }

  function openLeadModal(planName) {
    if (!leadModal) return;
    if (planName) setPlan(planName);
    if (leadForm) leadForm.hidden = false;
    if (leadSuccess) leadSuccess.hidden = true;
    showFormError('');
    leadModal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 60);
  }

  function closeLeadModal() {
    if (!leadModal) return;
    leadModal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.js-open-modal').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const plan = trigger.getAttribute('data-plan');
      openLeadModal(plan);
    });
  });

  planToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setPlan(btn.getAttribute('data-plan-choice'));
    });
  });

  if (leadModalClose) leadModalClose.addEventListener('click', closeLeadModal);
  if (leadSuccessClose) leadSuccessClose.addEventListener('click', closeLeadModal);

  if (leadModal) {
    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) closeLeadModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && leadModal && !leadModal.hidden) {
      closeLeadModal();
    }
  });

  // Gentle auto-formatting for @telegram handle and clearing invalid states on input
  if (tgInput) {
    tgInput.addEventListener('blur', () => {
      const v = tgInput.value.trim();
      if (v && !v.startsWith('@') && !v.startsWith('http')) {
        tgInput.value = '@' + v;
      }
    });
  }

  [nameInput, tgInput, phoneInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      showFormError('');
    });
  });

  if (checkOffer) {
    checkOffer.addEventListener('change', () => {
      const label = checkOffer.closest('.lead-check');
      if (label) label.classList.remove('is-invalid');
      showFormError('');
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      showFormError('');

      const name = (nameInput ? nameInput.value : '').trim();
      const telegram = (tgInput ? tgInput.value : '').trim();
      const phone = (phoneInput ? phoneInput.value : '').trim();
      const phoneDigits = phone.replace(/\D/g, '');
      const acceptOffer = Boolean(checkOffer && checkOffer.checked);
      const acceptMarketing = Boolean(checkMarketing && checkMarketing.checked);
      const plan = leadPlanInput ? leadPlanInput.value : 'Полная оплата (9.450 ₽)';
      const hpInput = leadForm.querySelector('input[name="website"]');
      const honeypot = hpInput ? hpInput.value : '';

      if (name.length < 2) {
        if (nameInput) {
          nameInput.classList.add('is-invalid');
          nameInput.focus();
        }
        showFormError('Пожалуйста, укажите ваше имя.');
        return;
      }

      if (telegram.length < 2) {
        if (tgInput) {
          tgInput.classList.add('is-invalid');
          tgInput.focus();
        }
        showFormError('Укажите ваш ник в Telegram (например, @username).');
        return;
      }

      if (phoneDigits.length < 10) {
        if (phoneInput) {
          phoneInput.classList.add('is-invalid');
          phoneInput.focus();
        }
        showFormError('Введите корректный номер телефона.');
        return;
      }

      if (!acceptOffer) {
        const label = checkOffer ? checkOffer.closest('.lead-check') : null;
        if (label) label.classList.add('is-invalid');
        showFormError('Чтобы отправить заявку, поставьте галочку согласия с Публичной офертой.');
        return;
      }

      const endpoint = cfg.formEndpoint || 'send.php';
      const payload = {
        name,
        telegram: telegram.startsWith('@') || telegram.startsWith('http') ? telegram : '@' + telegram,
        phone,
        plan,
        accept_offer: acceptOffer,
        accept_marketing: acceptMarketing,
        website: honeypot,
      };

      const submitTextEl = leadSubmitBtn ? leadSubmitBtn.querySelector('.btn-primary__text') : null;
      const prevText = submitTextEl ? submitTextEl.textContent : 'отправить заявку';

      if (leadSubmitBtn) leadSubmitBtn.disabled = true;
      if (submitTextEl) submitTextEl.textContent = 'отправляем...';

      try {
        const isGoogleScript = endpoint.includes('script.google.com');
        const resp = await fetch(endpoint, {
          method: 'POST',
          // text/plain avoids CORS preflight on Google Apps Script while still sending valid JSON body
          headers: { 'Content-Type': isGoogleScript ? 'text/plain;charset=utf-8' : 'application/json' },
          body: JSON.stringify(payload),
        });

        const isLocalPreview =
          window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (!resp.ok) {
          // On local static preview (without PHP) show clean demo confirmation
          if (isLocalPreview && (resp.status === 404 || resp.status === 405)) {
            console.info('[Local preview] Заявка готова к отправке в Telegram:', payload);
            leadForm.reset();
            leadForm.hidden = true;
            if (leadSuccess) leadSuccess.hidden = false;
            return;
          }
          let errText = 'Не удалось отправить заявку. Попробуйте ещё раз или напишите в @montagecore.';
          try {
            const errJson = await resp.json();
            if (errJson && errJson.error) errText = errJson.error;
          } catch (_) {}
          throw new Error(errText);
        }

        const data = await resp.json().catch(() => ({ ok: true }));
        if (data && data.ok === false) {
          throw new Error(data.error || 'Ошибка отправки. Напишите нам в @montagecore.');
        }

        leadForm.reset();
        leadForm.hidden = true;
        if (leadSuccess) leadSuccess.hidden = false;
      } catch (err) {
        showFormError(err.message || 'Ошибка соединения. Попробуйте ещё раз.');
      } finally {
        if (leadSubmitBtn) leadSubmitBtn.disabled = false;
        if (submitTextEl) submitTextEl.textContent = prevText;
      }
    });
  }

  /* ========================================================================
     7. COOKIE BANNER & DESKTOP MOBILE-HINT BANNER
     ======================================================================== */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieOkBtn = document.getElementById('cookieOkBtn');
  const cookieCloseBtn = document.getElementById('cookieCloseBtn');
  const COOKIE_KEY = 'km_cookie_accepted_v1';

  function dismissCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.hidden = true;
    try {
      localStorage.setItem(COOKIE_KEY, '1');
    } catch (_) {}
  }

  if (cookieBanner) {
    let accepted = false;
    try {
      accepted = localStorage.getItem(COOKIE_KEY) === '1';
    } catch (_) {}
    if (!accepted) {
      cookieBanner.hidden = false;
    }
    if (cookieOkBtn) cookieOkBtn.addEventListener('click', dismissCookieBanner);
    if (cookieCloseBtn) cookieCloseBtn.addEventListener('click', dismissCookieBanner);
  }

  const desktopBanner = document.getElementById('desktopBanner');
  const desktopBannerClose = document.getElementById('desktopBannerClose');
  if (desktopBanner && desktopBannerClose) {
    desktopBannerClose.addEventListener('click', () => {
      desktopBanner.hidden = true;
    });
  }
})();
