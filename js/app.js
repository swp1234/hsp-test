// HSP Sensory Overload Simulator
(async function initApp() {
    const CATEGORIES = ['sound', 'visual', 'touch', 'emotion', 'social'];
    const LEVELS_PER_CAT = 4;
    const RESULT_CONFIG = [
        { key: 'rock', min: 0, max: 20, color: '#4a90d9' },
        { key: 'breeze', min: 21, max: 40, color: '#2ecc71' },
        { key: 'wave', min: 41, max: 60, color: '#3498db' },
        { key: 'butterfly', min: 61, max: 80, color: '#9b59b6' },
        { key: 'antenna', min: 81, max: 100, color: '#e74c3c' }
    ];

    const RECOMMENDATION_MAP = {
        rock: ['eq-test', 'social-battery', 'emotion-iceberg', 'attachment-style', 'dopamine-type', 'emotion-temp', 'stress-response', 'burnout-test', 'anxiety-type', 'shadow-work', 'inner-child', 'trauma-response'],
        breeze: ['emotion-iceberg', 'attachment-style', 'social-battery', 'eq-test', 'emotion-temp', 'dopamine-type', 'stress-response', 'burnout-test', 'anxiety-type', 'shadow-work', 'inner-child', 'trauma-response'],
        wave: ['attachment-style', 'emotion-iceberg', 'stress-response', 'eq-test', 'social-battery', 'emotion-temp', 'dopamine-type', 'burnout-test', 'anxiety-type', 'shadow-work', 'inner-child', 'trauma-response'],
        butterfly: ['stress-response', 'burnout-test', 'anxiety-type', 'attachment-style', 'emotion-iceberg', 'shadow-work', 'inner-child', 'trauma-response', 'eq-test', 'social-battery', 'emotion-temp', 'dopamine-type'],
        antenna: ['burnout-test', 'stress-response', 'anxiety-type', 'shadow-work', 'inner-child', 'trauma-response', 'attachment-style', 'emotion-iceberg', 'eq-test', 'social-battery', 'emotion-temp', 'dopamine-type']
    };
    const RESET_CTA_COPY = {
        en: { kicker: 'USE THIS RESULT NOW', title: 'Build a 5-minute sensory reset card', desc: 'Choose the input that feels strongest and get one small, timed plan without taking another test.', action: 'Open reset card' },
        ko: { kicker: '결과를 지금 활용하세요', title: '5분 감각 리셋 카드 만들기', desc: '가장 강한 자극을 고르고, 다른 테스트 없이 작은 시간별 계획을 받으세요.', action: '리셋 카드 열기' },
        zh: { kicker: '立即使用这个结果', title: '制作5分钟感官重置卡', desc: '选择最强的刺激，不用再做测试，获得一个简短的计时计划。', action: '打开重置卡' },
        hi: { kicker: 'इस नतीजे का अभी उपयोग करें', title: '5-मिनट सेंसरी रीसेट कार्ड बनाएँ', desc: 'सबसे तेज़ इनपुट चुनें और बिना दूसरा टेस्ट लिए छोटा समयबद्ध प्लान पाएँ।', action: 'रीसेट कार्ड खोलें' },
        ru: { kicker: 'ИСПОЛЬЗУЙТЕ РЕЗУЛЬТАТ СЕЙЧАС', title: 'Создайте 5-минутную сенсорную карточку', desc: 'Выберите самый сильный стимул и получите короткий план без нового теста.', action: 'Открыть карточку' },
        ja: { kicker: '結果を今すぐ活用', title: '5分間の感覚リセットカードを作る', desc: '最も強い刺激を選び、別のテストなしで小さな時間別プランを作ります。', action: 'リセットカードを開く' },
        es: { kicker: 'USA ESTE RESULTADO AHORA', title: 'Crea una tarjeta de reinicio sensorial de 5 minutos', desc: 'Elige el estímulo más intenso y recibe un plan breve sin hacer otro test.', action: 'Abrir tarjeta' },
        pt: { kicker: 'USE ESTE RESULTADO AGORA', title: 'Crie um cartão de reset sensorial de 5 minutos', desc: 'Escolha o estímulo mais intenso e receba um plano curto sem outro teste.', action: 'Abrir cartão' },
        id: { kicker: 'GUNAKAN HASIL INI SEKARANG', title: 'Buat kartu reset sensorik 5 menit', desc: 'Pilih input terkuat dan dapatkan rencana singkat tanpa tes lain.', action: 'Buka kartu reset' },
        tr: { kicker: 'BU SONUCU ŞİMDİ KULLAN', title: '5 dakikalık duyusal sıfırlama kartı oluştur', desc: 'En güçlü uyaranı seçin ve başka test yapmadan kısa bir plan alın.', action: 'Kartı aç' },
        de: { kicker: 'ERGEBNIS JETZT NUTZEN', title: '5-Minuten-Karte bei Reizüberflutung erstellen', desc: 'Wähle den stärksten Reiz und erhalte ohne weiteren Test einen kleinen Zeitplan.', action: 'Reset-Karte öffnen' },
        fr: { kicker: 'UTILISEZ CE RÉSULTAT MAINTENANT', title: 'Créez une carte sensorielle de 5 minutes', desc: 'Choisissez le stimulus le plus fort et obtenez un petit plan sans autre test.', action: 'Ouvrir la carte' }
    };

    let currentCat = 0;
    let currentLevel = 0;
    let catScores = [0, 0, 0, 0, 0];
    let isAnimating = false;
    let currentResultKey = null;
    let currentPercent = 0;
    let resultInlineAdLoaded = false;
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
    const saveBtn = document.getElementById('btn-save');
    const twitterBtn = document.getElementById('btn-twitter');
    const copyBtn = document.getElementById('btn-copy');
    const retakeBtn = document.getElementById('btn-retake');
    const relatedGrid = document.getElementById('related-grid');
    const nextStepCard = document.getElementById('next-step-card');
    const primaryRelatedEmoji = document.getElementById('primary-related-emoji');
    const primaryRelatedTitle = document.getElementById('primary-related-title');
    const primaryRelatedDesc = document.getElementById('primary-related-desc');
    const primaryRelatedCta = document.getElementById('primary-related-cta');
    const primaryRelatedCtaText = document.getElementById('primary-related-cta-text');
    const relatedJumpBtn = document.getElementById('related-jump-btn');
    const resultInlineAd = document.getElementById('result-inline-ad');
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

        const category = CATEGORIES[currentCat];
        const level = currentLevel + 1;
        const button = canHandle ? handleBtn : limitBtn;
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);

        trackEvent(canHandle ? 'hsp_handle_click' : 'hsp_limit_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            category,
            level,
            step_index: currentCat + 1
        });

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

    function prioritizeRelatedCards(resultKey) {
        if (!relatedGrid) return;

        const cards = Array.from(relatedGrid.querySelectorAll('.related-card'));
        const rankMap = {};
        (RECOMMENDATION_MAP[resultKey] || RECOMMENDATION_MAP.wave).forEach((key, index) => {
            rankMap[key] = index;
        });

        cards.sort((a, b) => {
            const aKey = a.getAttribute('data-related-key') || '';
            const bKey = b.getAttribute('data-related-key') || '';
            const aRank = Object.prototype.hasOwnProperty.call(rankMap, aKey) ? rankMap[aKey] : 999;
            const bRank = Object.prototype.hasOwnProperty.call(rankMap, bKey) ? rankMap[bKey] : 999;
            return aRank - bRank;
        });

        cards.forEach((card, index) => {
            card.classList.toggle('is-featured', index < 2);
            card.setAttribute('data-rank', String(index + 1));
            relatedGrid.appendChild(card);
        });
    }

    function updatePrimaryRecommendation() {
        if (!relatedGrid || !primaryRelatedTitle || !primaryRelatedDesc || !primaryRelatedCta || !primaryRelatedCtaText || !primaryRelatedEmoji) {
            return;
        }

        const firstCard = relatedGrid.querySelector('.related-card');
        if (!firstCard) return;

        const title = firstCard.querySelector('.related-name')?.textContent?.trim() || 'Stress Response';
        const emoji = firstCard.querySelector('.related-emoji')?.textContent?.trim() || '🌈';
        const href = firstCard.getAttribute('href') || '#';
        const cardColor = firstCard.style.getPropertyValue('--card-color') || '#7c3aed';
        const relatedKey = firstCard.getAttribute('data-related-key') || '';
        const relatedRank = firstCard.getAttribute('data-rank') || '1';

        primaryRelatedEmoji.textContent = emoji;
        primaryRelatedTitle.textContent = title;
        primaryRelatedDesc.textContent = t('result.nextStepDesc');
        primaryRelatedCtaText.textContent = t('result.nextStepCta');
        primaryRelatedCta.href = href;
        primaryRelatedCta.setAttribute('data-related-key', relatedKey);
        primaryRelatedCta.setAttribute('data-related-rank', relatedRank);

        nextStepCard?.style.setProperty('--cta-color', cardColor);
        primaryRelatedCta.style.setProperty('--cta-color', cardColor);
        primaryRelatedTitle.style.setProperty('--cta-color', cardColor);
    }

    function updateSensoryResetCta(shouldTrack = false) {
        if (!sensoryResetCta || !sensoryResetLink) return;
        const lang = window.i18n?.getCurrentLanguage?.() || 'en';
        const copy = RESET_CTA_COPY[lang] || RESET_CTA_COPY.en;
        document.getElementById('sensory-reset-kicker').textContent = copy.kicker;
        document.getElementById('sensory-reset-title').textContent = copy.title;
        document.getElementById('sensory-reset-desc').textContent = copy.desc;
        sensoryResetLink.textContent = copy.action;
        sensoryResetLink.href = `reset.html?lang=${encodeURIComponent(lang)}&profile=${encodeURIComponent(currentResultKey || 'unknown')}&source=hsp_result`;
        if (shouldTrack) {
            trackEvent('sensory_reset_cta_view', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                cta_surface: 'hsp_result_reset',
                result_type: currentResultKey || 'unknown',
                result_value: currentPercent,
                revenue_goal: 'daily_0_10'
            });
        }
    }

    function ensureResultAdLoaded() {
        if (resultInlineAdLoaded || !resultInlineAd) return;
        const adNode = resultInlineAd.querySelector('.adsbygoogle');
        if (!adNode) return;

        try {
            (adsbygoogle = window.adsbygoogle || []).push({});
            resultInlineAdLoaded = true;
            trackEvent('hsp_result_ad_impression', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                result_type: currentResultKey || 'unknown'
            });
        } catch (error) {
            // Ad blockers or delayed AdSense init are safe to ignore.
        }
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

    function updatePercentileStat(resultKey) {
        const percentileStat = document.getElementById('percentile-stat');
        if (!percentileStat) return;

        const percentilePool = {
            rock: 8,
            breeze: 22,
            wave: 35,
            butterfly: 25,
            antenna: 10
        };

        percentileStat.innerHTML = t('result.percentileStat').replace('{percent}', percentilePool[resultKey] || 15);
    }

    function showResult(shouldTrack = true) {
        const total = catScores.reduce((sum, score) => sum + score, 0);
        const percent = Math.round((total / (CATEGORIES.length * LEVELS_PER_CAT)) * 100);
        const resultConfig = getResultConfig(percent);
        const typeData = t(`types.${resultConfig.key}`);

        currentResultKey = resultConfig.key;
        currentPercent = percent;

        const gauge = document.getElementById('result-gauge-fill');
        const gaugeText = document.getElementById('result-percent');
        gauge.style.background = `conic-gradient(${resultConfig.color} 0deg, ${resultConfig.color} 0deg, rgba(255,255,255,0.08) 0deg)`;
        gaugeText.textContent = '0%';

        setTimeout(() => {
            const degrees = (percent / 100) * 360;
            gauge.style.background = `conic-gradient(${resultConfig.color} 0deg, ${resultConfig.color} ${degrees}deg, rgba(255,255,255,0.08) ${degrees}deg)`;
            gaugeText.textContent = `${percent}%`;
        }, 400);

        document.getElementById('result-name').textContent = typeData.name || resultConfig.key;
        document.getElementById('result-desc').textContent = typeData.desc || '';
        document.getElementById('result-ratio').textContent = typeData.ratio || '';
        document.getElementById('result-compatible').textContent = Array.isArray(typeData.compatible) ? typeData.compatible.join(' · ') : '';

        const traitsList = document.getElementById('result-traits');
        traitsList.innerHTML = Array.isArray(typeData.traits) ? typeData.traits.map((trait) => `<li>${trait}</li>`).join('') : '';

        const tipsList = document.getElementById('result-tips');
        tipsList.innerHTML = Array.isArray(typeData.tips) ? typeData.tips.map((tip) => `<li>${tip}</li>`).join('') : '';

        updatePercentileStat(resultConfig.key);
        drawRadar();
        prioritizeRelatedCards(resultConfig.key);
        updatePrimaryRecommendation();
        updateSensoryResetCta(shouldTrack);
        ensureResultAdLoaded();
        showScreen('result');

        if (shouldTrack) {
            trackEvent('result_view', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                result_type: resultConfig.key,
                result_value: percent
            });
            trackEvent('quiz_complete', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                result_type: resultConfig.key,
                result_value: percent
            });
        }
    }

    function saveCurrentResultCard() {
        if (typeof ResultCard === 'undefined') return;

        const resultConfig = getResultConfig(currentPercent);
        const typeData = t(`types.${currentResultKey}`);
        const dimensions = CATEGORIES.map((category, index) => ({
            label: t(`categories.${category}.name`),
            pct: Math.round((catScores[index] / LEVELS_PER_CAT) * 100),
            color: resultConfig.color
        }));

        ResultCard.download({
            appName: 'HSP Test',
            typeName: typeData.name || currentResultKey,
            typeEmoji: '🌿',
            dimensions,
            primaryColor: '#7c3aed',
            tagline: 'dopabrain.com/hsp-test'
        });

        trackEvent('hsp_save_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent
        });
    }

    function shareToTwitter() {
        const typeName = t(`types.${currentResultKey}.name`);
        const rawText = t('share.twitterText').replace('{percent}', currentPercent).replace('{type}', typeName);
        const shareUrl = getSeoAwareUrl();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(rawText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'noopener');

        trackEvent('hsp_share_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            method: 'twitter',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent
        });
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
            method: 'copy',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent
        });
    }

    function resetToIntro() {
        showScreen('intro');
        currentCat = 0;
        currentLevel = 0;
        catScores = [0, 0, 0, 0, 0];
        currentResultKey = null;
        currentPercent = 0;
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
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.language-selector')) {
                langMenu?.classList.add('hidden');
            }
        });

        langOptions.forEach((option) => {
            option.addEventListener('click', async () => {
                const nextLang = option.getAttribute('data-lang');
                await window.i18n.setLanguage(nextLang);
                langOptions.forEach((item) => item.classList.remove('active'));
                option.classList.add('active');
                langMenu?.classList.add('hidden');

                if (screens.test.classList.contains('active')) {
                    renderCategory();
                } else if (screens.result.classList.contains('active') && currentResultKey) {
                    showResult(false);
                } else {
                    updateIntroStickyLabel();
                }
            });
        });
    }

    function startTest(ctaSurface = 'intro_primary') {
        currentCat = 0;
        currentLevel = 0;
        catScores = [0, 0, 0, 0, 0];
        currentResultKey = null;
        currentPercent = 0;
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
    saveBtn?.addEventListener('click', saveCurrentResultCard);
    twitterBtn?.addEventListener('click', shareToTwitter);
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

    primaryRelatedCta?.addEventListener('click', () => {
        trackEvent('hsp_primary_cta_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent,
            related_key: primaryRelatedCta.getAttribute('data-related-key') || '',
            related_rank: Number(primaryRelatedCta.getAttribute('data-related-rank') || '1')
        });
    });

    sensoryResetLink?.addEventListener('click', () => {
        trackEvent('sensory_reset_cta_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            cta_surface: 'hsp_result_reset',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent,
            destination_path: sensoryResetLink.getAttribute('href') || '',
            revenue_goal: 'daily_0_10'
        });
    });

    relatedJumpBtn?.addEventListener('click', () => {
        document.querySelector('.related-tests')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        trackEvent('hsp_related_jump_click', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            result_type: currentResultKey || 'unknown',
            result_value: currentPercent
        });
    });

    relatedGrid?.querySelectorAll('.related-card').forEach((card) => {
        card.addEventListener('click', () => {
            trackEvent('hsp_related_click', {
                app_name: 'hsp-test',
                event_category: 'hsp_test',
                result_type: currentResultKey || 'unknown',
                result_value: currentPercent,
                related_key: card.getAttribute('data-related-key') || '',
                related_rank: Number(card.getAttribute('data-rank') || '0')
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
