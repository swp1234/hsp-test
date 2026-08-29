// HSP Sensory Preferences Check
(async function initApp() {
    const CATEGORIES = ['sound', 'visual', 'touch', 'emotion', 'social'];
    const LEVELS_PER_CAT = 4;
    const RESULT_CONFIG = [
        { min: 0, max: 20, color: '#4a90d9' },
        { min: 21, max: 40, color: '#2ecc71' },
        { min: 41, max: 60, color: '#3498db' },
        { min: 61, max: 80, color: '#9b59b6' },
        { min: 81, max: 100, color: '#e74c3c' }
    ];
    const RESET_CTA_COPY = {
        en: { kicker: 'TRY ONE SMALL STEP', title: 'Build a private 5-minute reset card', desc: 'Choose what feels strongest right now and get a small timed plan. Your selections stay in this browser.', action: 'Open 5-minute reset' },
        ko: { kicker: '작은 행동 하나 시작하기', title: '비공개 5분 감각 리셋 카드 만들기', desc: '지금 가장 강한 자극을 고르고 짧은 시간별 계획을 받으세요. 선택값은 이 브라우저에만 남습니다.', action: '5분 리셋 열기' },
        zh: { kicker: '先尝试一个小步骤', title: '制作私密的5分钟感官重置卡', desc: '选择此刻最强的刺激，获得简短计时计划。你的选择只保留在此浏览器。', action: '打开5分钟重置' },
        hi: { kicker: 'एक छोटा कदम आज़माएँ', title: 'निजी 5-मिनट सेंसरी रीसेट कार्ड बनाएँ', desc: 'अभी सबसे तेज़ इनपुट चुनें और छोटा समयबद्ध प्लान पाएँ। चुनाव इसी ब्राउज़र में रहते हैं।', action: '5-मिनट रीसेट खोलें' },
        ru: { kicker: 'ПОПРОБУЙТЕ ОДИН МАЛЕНЬКИЙ ШАГ', title: 'Создайте личную 5-минутную карточку', desc: 'Выберите самый сильный стимул и получите короткий план. Выбор остаётся в этом браузере.', action: 'Открыть 5-минутный план' },
        ja: { kicker: '小さな一歩を試す', title: '非公開の5分間リセットカードを作る', desc: '今最も強い刺激を選び、短い時間別プランを作ります。選択はこのブラウザだけに残ります。', action: '5分リセットを開く' },
        es: { kicker: 'PRUEBA UN PASO PEQUEÑO', title: 'Crea una tarjeta privada de reinicio de 5 minutos', desc: 'Elige lo más intenso ahora y recibe un plan breve. Tus elecciones quedan en este navegador.', action: 'Abrir reinicio de 5 minutos' },
        pt: { kicker: 'TENTE UM PEQUENO PASSO', title: 'Crie um cartão privado de reset de 5 minutos', desc: 'Escolha o estímulo mais forte agora e receba um plano curto. Suas escolhas ficam neste navegador.', action: 'Abrir reset de 5 minutos' },
        id: { kicker: 'COBA SATU LANGKAH KECIL', title: 'Buat kartu reset privat 5 menit', desc: 'Pilih input terkuat saat ini dan dapatkan rencana singkat. Pilihan tetap di browser ini.', action: 'Buka reset 5 menit' },
        tr: { kicker: 'KÜÇÜK BİR ADIM DENEYİN', title: 'Özel bir 5 dakikalık sıfırlama kartı oluşturun', desc: 'Şu an en güçlü uyaranı seçin ve kısa bir plan alın. Seçimler bu tarayıcıda kalır.', action: '5 dakikalık sıfırlamayı aç' },
        de: { kicker: 'EINEN KLEINEN SCHRITT TESTEN', title: 'Private 5-Minuten-Reset-Karte erstellen', desc: 'Wähle den stärksten Reiz und erhalte einen kurzen Plan. Deine Auswahl bleibt in diesem Browser.', action: '5-Minuten-Reset öffnen' },
        fr: { kicker: 'ESSAYEZ UNE PETITE ÉTAPE', title: 'Créez une carte privée de 5 minutes', desc: 'Choisissez le stimulus le plus fort et obtenez un court plan. Vos choix restent dans ce navigateur.', action: 'Ouvrir le reset de 5 minutes' }
    };
    let currentCat = 0;
    let currentLevel = 0;
    let catScores = [0, 0, 0, 0, 0];
    let isAnimating = false;
    let hasCurrentResult = false;
    let sensoryResetViewSent = false;
    let sensoryResetObserver = null;
    let introCtaViewSent = false;
    let introStickyViewSent = false;
    let introStickyMountTimer = null;
    let autoStartConsumed = false;

    const screens = {
        intro: document.getElementById('screen-intro'),
        test: document.getElementById('screen-test'),
        result: document.getElementById('screen-result')
    };

    const startBtn = document.getElementById('btn-start');
    const introCtaPanel = document.querySelector('.intro-cta-panel');
    const aboutTestSection = document.querySelector('.about-test-section');
    const handleBtn = document.getElementById('btn-handle');
    const limitBtn = document.getElementById('btn-limit');
    const copyBtn = document.getElementById('btn-copy');
    const retakeBtn = document.getElementById('btn-retake');
    const relatedGrid = document.getElementById('related-grid');
    const sensoryResetCta = document.getElementById('sensory-reset-cta');
    const sensoryResetLink = document.getElementById('sensory-reset-link');
    const langToggle = document.getElementById('lang-toggle');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const themeToggle = document.getElementById('theme-toggle');

    function t(key) {
        if (!window.i18n) return key;
        const value = window.i18n.t(key);
        return value !== key ? value : key;
    }

    function trackEvent(name, params = {}) {
        if (typeof gtag !== 'function') return;
        gtag('event', name, params);
    }

    function trackIntroCtaView() {
        if (introCtaViewSent) return;
        introCtaViewSent = true;
        trackEvent('hsp_intro_cta_view', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: introCtaPanel?.getAttribute('data-cta-surface') || 'intro_primary'
        });
    }

    function getUrlParam(name) {
        try {
            return new URLSearchParams(window.location.search || '').get(name) || '';
        } catch (error) {
            return '';
        }
    }

    function getAutoStartSurface() {
        if (getUrlParam('start') !== '1') return '';
        return getUrlParam('surface') || getUrlParam('utm_content') || 'url_start';
    }

    function getSeoAwareUrl() {
        if (window.i18n && typeof window.i18n.getSeoHref === 'function') {
            return window.i18n.getSeoHref(window.i18n.getCurrentLanguage());
        }

        const url = new URL(window.location.origin + window.location.pathname);
        const lang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        if (lang && lang !== 'ko') url.searchParams.set('lang', lang);
        return url.toString();
    }

    function showScreen(name) {
        Object.entries(screens).forEach(([screenName, screen]) => {
            if (!screen) return;
            if (screenName === 'test') {
                screen.className = 'screen' + (screenName === name ? ' active' : '');
            } else {
                screen.classList.toggle('active', screenName === name);
            }
        });
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        if (name === 'intro') {
            scheduleIntroStickyStart();
        } else {
            removeIntroStickyStart();
        }
    }

    function shouldShowIntroStickyStart() {
        if (getAutoStartSurface()) return false;
        if (!screens.intro?.classList.contains('active')) return false;
        try {
            return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 720;
        } catch (error) {
            return window.innerWidth < 720;
        }
    }

    function updateIntroStickyLabel() {
        const sticky = document.querySelector('.hsp-intro-sticky-start');
        const label = sticky?.querySelector('.hsp-intro-sticky-label');
        if (label) label.textContent = t('app.start');
    }

    function trackIntroStickyView() {
        if (introStickyViewSent) return;
        introStickyViewSent = true;
        trackEvent('hsp_intro_sticky_view', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: 'intro_sticky'
        });
    }

    function removeIntroStickyStart() {
        if (introStickyMountTimer) {
            clearTimeout(introStickyMountTimer);
            introStickyMountTimer = null;
        }
        document.querySelector('.hsp-intro-sticky-start')?.remove();
        document.body.classList.remove('has-hsp-intro-sticky-start');
    }

    function mountIntroStickyStart() {
        if (!shouldShowIntroStickyStart() || document.querySelector('.hsp-intro-sticky-start')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'hsp-intro-sticky-start';
        button.setAttribute('data-cta-surface', 'intro_sticky');
        button.innerHTML = '<span class="hsp-intro-sticky-label"></span>';
        button.addEventListener('click', () => startTest('intro_sticky'));
        document.body.appendChild(button);
        document.body.classList.add('has-hsp-intro-sticky-start');
        updateIntroStickyLabel();
        trackIntroStickyView();
    }

    function scheduleIntroStickyStart() {
        if (introStickyMountTimer) clearTimeout(introStickyMountTimer);
        introStickyMountTimer = setTimeout(() => {
            introStickyMountTimer = null;
            mountIntroStickyStart();
        }, 700);
    }

    function getResultConfig(percent) {
        return RESULT_CONFIG.find((config) => percent >= config.min && percent <= config.max) || RESULT_CONFIG[RESULT_CONFIG.length - 1];
    }

    function renderCategory() {
        const category = CATEGORIES[currentCat];
        document.getElementById('cat-emoji').textContent = t(`categories.${category}.emoji`);
        document.getElementById('cat-name').textContent = t(`categories.${category}.name`);
        document.getElementById('cat-progress').textContent = `${currentCat + 1} / ${CATEGORIES.length}`;

        const testScreen = screens.test;
        testScreen.classList.remove('category-enter');
        void testScreen.offsetHeight;
        testScreen.classList.add('category-enter');

        renderLevel();
    }

    function renderLevel() {
        if (isAnimating) return;

        const category = CATEGORIES[currentCat];
        const levelKey = `l${currentLevel + 1}`;
        const levelLabels = t('test.levels');
        const levelLabel = Array.isArray(levelLabels) ? levelLabels[currentLevel] : `Level ${currentLevel + 1}`;

        document.getElementById('stim-title').textContent = t(`categories.${category}.${levelKey}.title`);
        document.getElementById('stim-desc').textContent = t(`categories.${category}.${levelKey}.desc`);
        document.getElementById('meter-level').textContent = String(currentLevel + 1);
        document.getElementById('meter-label').textContent = levelLabel;

        const fillDeg = ((currentLevel + 1) / LEVELS_PER_CAT) * 360;
        const meterFill = document.getElementById('meter-fill');
        const colors = ['var(--primary)', 'var(--primary)', '#f59e0b', '#ef4444'];
        const fillColor = colors[currentLevel] || 'var(--primary)';
        meterFill.style.background = `conic-gradient(${fillColor} 0deg, ${fillColor} ${fillDeg}deg, rgba(255,255,255,0.08) ${fillDeg}deg)`;

        const dots = document.querySelectorAll('#level-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index <= currentLevel);
            dot.classList.toggle('current', index === currentLevel);
        });

        screens.test.className = `screen active intensity-${currentLevel + 1}`;

        const card = document.getElementById('stimulus-card');
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = 'cardSlideIn 0.4s ease';
    }

    function advanceCategory() {
        currentCat += 1;
        if (currentCat < CATEGORIES.length) {
            currentLevel = 0;
            renderCategory();
            return;
        }
        showResult();
    }

    function handleChoice(canHandle) {
        if (isAnimating) return;
        isAnimating = true;

        const button = canHandle ? handleBtn : limitBtn;
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);

        if (canHandle) {
            if (currentLevel < LEVELS_PER_CAT - 1) {
                currentLevel += 1;
                setTimeout(() => {
                    isAnimating = false;
                    renderLevel();
                }, 350);
                return;
            }

            catScores[currentCat] = 0;
        } else {
            catScores[currentCat] = LEVELS_PER_CAT - currentLevel;
        }

        setTimeout(() => {
            isAnimating = false;
            advanceCategory();
        }, 350);
    }

    function updateSensoryResetCta() {
        if (!sensoryResetCta || !sensoryResetLink) return;
        const lang = window.i18n?.getCurrentLanguage?.() || 'en';
        const copy = RESET_CTA_COPY[lang] || RESET_CTA_COPY.en;
        document.getElementById('sensory-reset-kicker').textContent = copy.kicker;
        document.getElementById('sensory-reset-title').textContent = copy.title;
        document.getElementById('sensory-reset-desc').textContent = copy.desc;
        sensoryResetLink.textContent = copy.action;
        sensoryResetLink.href = `reset.html?lang=${encodeURIComponent(lang)}&source=hsp_result`;
    }

    function trackSensoryResetView() {
        if (sensoryResetViewSent) return;
        sensoryResetViewSent = true;
        trackEvent('sensory_reset_cta_view', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: 'hsp_result_reset',
            target_slug: 'sensory-reset',
            destination_path: '/hsp-test/reset.html',
            content_locale: window.i18n?.getCurrentLanguage?.() || 'en',
            experiment_variant: 'reset_primary_v1',
            revenue_goal: 'daily_0_10'
        });
    }

    function observeSensoryResetCta() {
        sensoryResetObserver?.disconnect();
        sensoryResetObserver = null;
        if (!sensoryResetCta || sensoryResetViewSent) return;

        if ('IntersectionObserver' in window) {
            sensoryResetObserver = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
                trackSensoryResetView();
                sensoryResetObserver?.disconnect();
                sensoryResetObserver = null;
            }, { threshold: [0.5] });
            sensoryResetObserver.observe(sensoryResetCta);
            return;
        }

        const checkVisibility = () => {
            const rect = sensoryResetCta.getBoundingClientRect();
            const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            if (visible < rect.height * 0.5) return;
            trackSensoryResetView();
            window.removeEventListener('scroll', checkVisibility);
            window.removeEventListener('resize', checkVisibility);
        };
        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility);
        requestAnimationFrame(checkVisibility);
    }

    function focusResultHeading() {
        const heading = document.getElementById('result-heading');
        if (!heading) return;
        requestAnimationFrame(() => {
            heading.focus({ preventScroll: true });
            observeSensoryResetCta();
        });
    }

    function drawRadar() {
        const svg = document.getElementById('radar-chart');
        if (!svg) return;

        const cx = 150;
        const cy = 150;
        const maxR = 110;
        const angleStep = (2 * Math.PI) / CATEGORIES.length;
        const offset = -Math.PI / 2;
        const values = catScores.map((score) => (score / LEVELS_PER_CAT) * 100);

        function getPoint(index, radius) {
            const angle = offset + index * angleStep;
            return {
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle)
            };
        }

        let html = '';

        for (let ring = 0.25; ring <= 1; ring += 0.25) {
            const points = CATEGORIES.map((_, index) => getPoint(index, maxR * ring));
            html += `<polygon points="${points.map((point) => `${point.x},${point.y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
        }

        CATEGORIES.forEach((_, index) => {
            const point = getPoint(index, maxR);
            html += `<line x1="${cx}" y1="${cy}" x2="${point.x}" y2="${point.y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
        });

        const dataPoints = values.map((value, index) => getPoint(index, maxR * Math.max(value, 5) / 100));
        html += `<polygon points="${dataPoints.map((point) => `${point.x},${point.y}`).join(' ')}" fill="rgba(124,58,237,0.2)" stroke="var(--primary)" stroke-width="2.5" class="radar-data"/>`;

        dataPoints.forEach((point) => {
            html += `<circle cx="${point.x}" cy="${point.y}" r="5" fill="var(--primary)" stroke="var(--bg)" stroke-width="2"/>`;
        });

        CATEGORIES.forEach((category, index) => {
            const point = getPoint(index, maxR + 30);
            const emoji = t(`categories.${category}.emoji`);
            const name = t(`categories.${category}.name`);
            const value = Math.round(values[index]);
            const anchor = point.x < cx - 10 ? 'end' : point.x > cx + 10 ? 'start' : 'middle';
            html += `<text x="${point.x}" y="${point.y - 6}" text-anchor="${anchor}" font-size="12" font-weight="600" dominant-baseline="middle">${emoji}</text>`;
            html += `<text x="${point.x}" y="${point.y + 10}" text-anchor="${anchor}" font-size="10" dominant-baseline="middle">${name} ${value}%</text>`;
        });

        svg.innerHTML = html;
    }

    function showResult(shouldTrack = true) {
        const total = catScores.reduce((sum, score) => sum + score, 0);
        const percent = Math.round((total / (CATEGORIES.length * LEVELS_PER_CAT)) * 100);
        const resultConfig = getResultConfig(percent);

        hasCurrentResult = true;

        const gauge = document.getElementById('result-gauge-fill');
        const gaugeText = document.getElementById('result-percent');
        gauge.style.background = `conic-gradient(${resultConfig.color} 0deg, ${resultConfig.color} 0deg, rgba(255,255,255,0.08) 0deg)`;
        gaugeText.textContent = '0%';

        setTimeout(() => {
            const degrees = (percent / 100) * 360;
            gauge.style.background = `conic-gradient(${resultConfig.color} 0deg, ${resultConfig.color} ${degrees}deg, rgba(255,255,255,0.08) ${degrees}deg)`;
            gaugeText.textContent = `${percent}%`;
        }, 400);

        drawRadar();
        updateSensoryResetCta();
        showScreen('result');
        focusResultHeading();

        if (shouldTrack) {
            trackEvent('result_view', {
                app_name: 'hsp-test',
                event_category: 'hsp_test'
            });
            trackEvent('quiz_complete', {
                app_name: 'hsp-test',
                event_category: 'hsp_test'
            });
        }
    }

    async function copyShareUrl() {
        const shareUrl = getSeoAwareUrl();
        try {
            await navigator.clipboard.writeText(shareUrl);
            const original = t('share.copyUrl');
            copyBtn.textContent = t('share.copied');
            setTimeout(() => {
                copyBtn.textContent = original;
            }, 1800);
        } catch (error) {
            window.prompt('Copy this URL', shareUrl);
        }

        trackEvent('hsp_share_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            method: 'copy'
        });
    }

    function resetToIntro() {
        sensoryResetObserver?.disconnect();
        sensoryResetObserver = null;
        sensoryResetViewSent = false;
        showScreen('intro');
        currentCat = 0;
        currentLevel = 0;
        catScores = [0, 0, 0, 0, 0];
        hasCurrentResult = false;
        isAnimating = false;

        trackEvent('hsp_retry_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test'
        });
    }

    function initTheme() {
        if (!themeToggle) return;
        const savedTheme = localStorage.getItem('app-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('app-theme', nextTheme);
            themeToggle.textContent = nextTheme === 'light' ? '🌙' : '☀️';
        });
    }

    function initLanguageMenu() {
        document.querySelector(`[data-lang="${window.i18n.getCurrentLanguage()}"]`)?.classList.add('active');

        langToggle?.addEventListener('click', () => {
            langMenu?.classList.toggle('hidden');
            langToggle.setAttribute('aria-expanded', String(!langMenu?.classList.contains('hidden')));
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.language-selector')) {
                langMenu?.classList.add('hidden');
                langToggle?.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape' || langMenu?.classList.contains('hidden')) return;
            langMenu.classList.add('hidden');
            langToggle?.setAttribute('aria-expanded', 'false');
            langToggle?.focus();
        });

        langOptions.forEach((option) => {
            option.addEventListener('click', async () => {
                const nextLang = option.getAttribute('data-lang');
                await window.i18n.setLanguage(nextLang);
                langOptions.forEach((item) => item.classList.remove('active'));
                option.classList.add('active');
                langMenu?.classList.add('hidden');
                langToggle?.setAttribute('aria-expanded', 'false');

                if (screens.test.classList.contains('active')) {
                    renderCategory();
                } else if (screens.result.classList.contains('active') && hasCurrentResult) {
                    showResult(false);
                } else {
                    updateIntroStickyLabel();
                }
            });
        });
    }

    function startTest(ctaSurface = 'intro_primary') {
        sensoryResetObserver?.disconnect();
        sensoryResetObserver = null;
        sensoryResetViewSent = false;
        currentCat = 0;
        currentLevel = 0;
        catScores = [0, 0, 0, 0, 0];
        hasCurrentResult = false;
        isAnimating = false;
        showScreen('test');
        renderCategory();

        trackEvent('hsp_intro_start_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: ctaSurface
        });
        trackEvent('quiz_start', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            content_type: 'overload_simulator',
            cta_surface: ctaSurface
        });
        trackEvent('test_start', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            content_type: 'overload_simulator',
            cta_surface: ctaSurface
        });
    }

    startBtn?.addEventListener('click', () => {
        startTest(startBtn.getAttribute('data-cta-surface') || 'intro_primary');
    });

    handleBtn?.addEventListener('click', () => handleChoice(true));
    limitBtn?.addEventListener('click', () => handleChoice(false));
    copyBtn?.addEventListener('click', copyShareUrl);
    retakeBtn?.addEventListener('click', resetToIntro);

    if (introCtaPanel && 'IntersectionObserver' in window) {
        const introCtaObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                trackIntroCtaView();
                introCtaObserver.disconnect();
            }
        }, { threshold: 0.55 });
        introCtaObserver.observe(introCtaPanel);
    } else {
        setTimeout(trackIntroCtaView, 800);
    }

    aboutTestSection?.addEventListener('toggle', () => {
        trackEvent('hsp_about_toggle', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            is_open: aboutTestSection.open
        });
    });

    sensoryResetLink?.addEventListener('click', () => {
        trackEvent('sensory_reset_cta_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: 'hsp_result_reset',
            target_slug: 'sensory-reset',
            destination_path: '/hsp-test/reset.html',
            content_locale: window.i18n?.getCurrentLanguage?.() || 'en',
            experiment_variant: 'reset_primary_v1',
            revenue_goal: 'daily_0_10'
        });
    });

    relatedGrid?.querySelectorAll('.related-card').forEach((card) => {
        card.addEventListener('click', () => {
            trackEvent('hsp_related_click', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                related_key: card.getAttribute('data-related-key') || ''
            });
        });
    });

    try {
        await window.i18n.loadTranslations(window.i18n.getCurrentLanguage());
        window.i18n.updateUI();
        initTheme();
        initLanguageMenu();
    } catch (error) {
        console.warn('i18n init failed:', error);
        initTheme();
        initLanguageMenu();
    } finally {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 300);
        }
        const autoStartSurface = getAutoStartSurface();
        if (autoStartSurface && !autoStartConsumed && screens.intro?.classList.contains('active')) {
            autoStartConsumed = true;
            setTimeout(() => startTest(autoStartSurface), 80);
        } else {
            scheduleIntroStickyStart();
        }
    }
})();
