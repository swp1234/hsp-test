// HSP Sensory Overload Simulator

// i18n init
(async function initI18n() {
    try {
        await i18n.loadTranslations(i18n.getCurrentLanguage());
        i18n.updateUI();
        const langToggle = document.getElementById('lang-toggle');
        const langMenu = document.getElementById('lang-menu');
        const langOptions = document.querySelectorAll('.lang-option');
        document.querySelector(`[data-lang="${i18n.getCurrentLanguage()}"]`)?.classList.add('active');
        langToggle?.addEventListener('click', () => langMenu.classList.toggle('hidden'));
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector')) langMenu?.classList.add('hidden');
        });
        langOptions.forEach(opt => {
            opt.addEventListener('click', async () => {
                await i18n.setLanguage(opt.getAttribute('data-lang'));
                langOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                langMenu.classList.add('hidden');
            });
        });
    } catch (e) {
        console.warn('i18n init failed:', e);
    } finally {
        const loader = document.getElementById('app-loader');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 300); }
    }
})();

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('app-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    themeToggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('app-theme', next);
        themeToggle.textContent = next === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    });
}

// Constants
const CATEGORIES = ['sound', 'visual', 'touch', 'emotion', 'social'];
const LEVELS_PER_CAT = 4;
const RESULT_CONFIG = [
    { key: 'rock', min: 0, max: 20, color: '#4a90d9' },
    { key: 'breeze', min: 21, max: 40, color: '#2ecc71' },
    { key: 'wave', min: 41, max: 60, color: '#3498db' },
    { key: 'butterfly', min: 61, max: 80, color: '#9b59b6' },
    { key: 'antenna', min: 81, max: 100, color: '#e74c3c' }
];

// State
let currentCat = 0;
let currentLevel = 0;
let catScores = [0, 0, 0, 0, 0];
let isAnimating = false;

// DOM
const screens = {
    intro: document.getElementById('screen-intro'),
    test: document.getElementById('screen-test'),
    result: document.getElementById('screen-result')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo(0, 0);
}

// Start test
document.getElementById('btn-start').addEventListener('click', () => {
    currentCat = 0;
    currentLevel = 0;
    catScores = [0, 0, 0, 0, 0];
    showScreen('test');
    renderCategory();
    if (typeof gtag === 'function') {
        gtag('event', 'test_start', { app_name: 'hsp-test', content_type: 'overload_simulator' });
    }
});

function renderCategory() {
    const cat = CATEGORIES[currentCat];
    const catEmoji = i18n?.t(`categories.${cat}.emoji`) || '';
    const catName = i18n?.t(`categories.${cat}.name`) || cat;

    document.getElementById('cat-emoji').textContent = catEmoji;
    document.getElementById('cat-name').textContent = catName;
    document.getElementById('cat-progress').textContent = `${currentCat + 1} / ${CATEGORIES.length}`;

    // Category enter animation
    const testScreen = screens.test;
    testScreen.classList.remove('category-enter');
    void testScreen.offsetHeight;
    testScreen.classList.add('category-enter');

    renderLevel();
}

function renderLevel() {
    if (isAnimating) return;

    const cat = CATEGORIES[currentCat];
    const levelKey = `l${currentLevel + 1}`;
    const levelTitle = i18n?.t(`categories.${cat}.${levelKey}.title`) || '';
    const levelDesc = i18n?.t(`categories.${cat}.${levelKey}.desc`) || '';
    const levelLabels = i18n?.t('test.levels');
    const levelLabel = Array.isArray(levelLabels) ? levelLabels[currentLevel] : `Level ${currentLevel + 1}`;

    // Stimulus card
    document.getElementById('stim-title').textContent = levelTitle;
    document.getElementById('stim-desc').textContent = levelDesc;

    // Meter
    document.getElementById('meter-level').textContent = currentLevel + 1;
    document.getElementById('meter-label').textContent = levelLabel;

    const fillDeg = ((currentLevel + 1) / LEVELS_PER_CAT) * 360;
    const meterFill = document.getElementById('meter-fill');
    // Color shifts from primary to red as intensity increases
    const colors = ['var(--primary)', 'var(--primary)', '#f59e0b', '#ef4444'];
    const fillColor = colors[currentLevel] || 'var(--primary)';
    meterFill.style.background = `conic-gradient(${fillColor} 0deg, ${fillColor} ${fillDeg}deg, rgba(255,255,255,0.08) ${fillDeg}deg)`;

    // Level dots
    const dots = document.querySelectorAll('#level-dots .dot');
    dots.forEach((d, i) => {
        d.classList.toggle('active', i <= currentLevel);
        d.classList.toggle('current', i === currentLevel);
    });

    // Intensity class for visual effects
    screens.test.className = `screen active intensity-${currentLevel + 1}`;

    // Card animation
    const card = document.getElementById('stimulus-card');
    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = 'cardSlideIn 0.4s ease';
}

function handleChoice(canHandle) {
    if (isAnimating) return;
    isAnimating = true;

    // Visual feedback
    const btnId = canHandle ? 'btn-handle' : 'btn-limit';
    const btn = document.getElementById(btnId);
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 200);

    if (canHandle) {
        if (currentLevel < LEVELS_PER_CAT - 1) {
            // Next intensity level
            currentLevel++;
            setTimeout(() => {
                isAnimating = false;
                renderLevel();
            }, 350);
        } else {
            // Handled all 4 levels — not sensitive (score 0)
            catScores[currentCat] = 0;
            setTimeout(() => {
                isAnimating = false;
                advanceCategory();
            }, 350);
        }
    } else {
        // Hit limit — sensitivity = 4 - currentLevel
        catScores[currentCat] = LEVELS_PER_CAT - currentLevel;
        setTimeout(() => {
            isAnimating = false;
            advanceCategory();
        }, 350);
    }
}

function advanceCategory() {
    currentCat++;
    if (currentCat < CATEGORIES.length) {
        currentLevel = 0;
        renderCategory();
    } else {
        showResult();
    }
}

// Button listeners
document.getElementById('btn-handle').addEventListener('click', () => handleChoice(true));
document.getElementById('btn-limit').addEventListener('click', () => handleChoice(false));

function showResult() {
    const total = catScores.reduce((a, b) => a + b, 0);
    const percent = Math.round((total / (CATEGORIES.length * LEVELS_PER_CAT)) * 100);

    // Find result type
    let resultCfg = RESULT_CONFIG[RESULT_CONFIG.length - 1];
    for (const cfg of RESULT_CONFIG) {
        if (percent >= cfg.min && percent <= cfg.max) { resultCfg = cfg; break; }
    }

    const typeData = i18n?.t(`types.${resultCfg.key}`) || {};

    // Gauge animation
    const gauge = document.getElementById('result-gauge-fill');
    const gaugeText = document.getElementById('result-percent');
    gauge.style.background = `conic-gradient(${resultCfg.color} 0deg, ${resultCfg.color} 0deg, rgba(255,255,255,0.08) 0deg)`;
    gaugeText.textContent = '0%';

    setTimeout(() => {
        const deg = (percent / 100) * 360;
        gauge.style.background = `conic-gradient(${resultCfg.color} 0deg, ${resultCfg.color} ${deg}deg, rgba(255,255,255,0.08) ${deg}deg)`;
        gaugeText.textContent = percent + '%';
    }, 400);

    // Type info
    document.getElementById('result-name').textContent = typeData.name || resultCfg.key;
    document.getElementById('result-desc').textContent = typeData.desc || '';
    document.getElementById('result-ratio').textContent = typeData.ratio || '';

    // Traits
    const traitsList = document.getElementById('result-traits');
    traitsList.innerHTML = (typeData.traits || []).map(t => `<li>${t}</li>`).join('');

    // Tips
    const tipsList = document.getElementById('result-tips');
    tipsList.innerHTML = (typeData.tips || []).map(t => `<li>${t}</li>`).join('');

    // Compatible
    document.getElementById('result-compatible').textContent = (typeData.compatible || []).join(' & ');

    // Radar chart
    drawRadar();

    showScreen('result');

    if (typeof gtag === 'function') {
        gtag('event', 'test_complete', {
            app_name: 'hsp-test',
            event_category: 'hsp_test',
            result_type: resultCfg.key,
            result_value: percent
        });
    }
}

function drawRadar() {
    const svg = document.getElementById('radar-chart');
    const cx = 150, cy = 150, maxR = 110;
    const angleStep = (2 * Math.PI) / CATEGORIES.length;
    const offset = -Math.PI / 2;

    // Sensitivity percent per category (score 0-4 → 0-100%)
    const values = catScores.map(s => (s / LEVELS_PER_CAT) * 100);

    function getPoint(index, radius) {
        const angle = offset + index * angleStep;
        return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    }

    let html = '';

    // Background rings
    for (let r = 0.25; r <= 1; r += 0.25) {
        const pts = CATEGORIES.map((_, i) => getPoint(i, maxR * r));
        html += `<polygon points="${pts.map(p => `${p.x},${p.y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
    }

    // Axis lines
    CATEGORIES.forEach((_, i) => {
        const p = getPoint(i, maxR);
        html += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
    });

    // Data polygon
    const dataPts = values.map((v, i) => getPoint(i, maxR * Math.max(v, 5) / 100));
    html += `<polygon points="${dataPts.map(p => `${p.x},${p.y}`).join(' ')}" fill="rgba(124,58,237,0.2)" stroke="var(--primary)" stroke-width="2.5" class="radar-data"/>`;

    // Data points
    dataPts.forEach(p => {
        html += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--primary)" stroke="var(--bg)" stroke-width="2"/>`;
    });

    // Labels
    CATEGORIES.forEach((cat, i) => {
        const p = getPoint(i, maxR + 30);
        const emoji = i18n?.t(`categories.${cat}.emoji`) || '';
        const name = i18n?.t(`categories.${cat}.name`) || cat;
        const val = Math.round(values[i]);
        const anchor = p.x < cx - 10 ? 'end' : p.x > cx + 10 ? 'start' : 'middle';
        html += `<text x="${p.x}" y="${p.y - 6}" text-anchor="${anchor}" font-size="12" font-weight="600" dominant-baseline="middle">${emoji}</text>`;
        html += `<text x="${p.x}" y="${p.y + 10}" text-anchor="${anchor}" font-size="10" dominant-baseline="middle">${name} ${val}%</text>`;
    });

    svg.innerHTML = html;
}

// Share
document.getElementById('btn-twitter')?.addEventListener('click', () => {
    const total = catScores.reduce((a, b) => a + b, 0);
    const percent = Math.round((total / (CATEGORIES.length * LEVELS_PER_CAT)) * 100);
    let resultKey = 'rock';
    for (const cfg of RESULT_CONFIG) {
        if (percent >= cfg.min && percent <= cfg.max) { resultKey = cfg.key; break; }
    }
    const typeName = i18n?.t(`types.${resultKey}.name`) || resultKey;
    let text = i18n?.t('share.twitterText') || 'My HSP sensitivity: {percent}%! Type: {type}';
    text = text.replace('{percent}', percent).replace('{type}', typeName);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://dopabrain.com/hsp-test/')}`;
    window.open(url, '_blank');
    if (typeof gtag === 'function') gtag('event', 'share', { method: 'twitter', app_name: 'hsp-test' });
});

document.getElementById('btn-copy')?.addEventListener('click', () => {
    navigator.clipboard.writeText('https://dopabrain.com/hsp-test/').then(() => {
        const btn = document.getElementById('btn-copy');
        const orig = btn.textContent;
        btn.textContent = i18n?.t('share.copied') || 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    });
    if (typeof gtag === 'function') gtag('event', 'share', { method: 'clipboard', app_name: 'hsp-test' });
});

// Retake
document.getElementById('btn-retake')?.addEventListener('click', () => {
    showScreen('intro');
});
