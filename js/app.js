// Initialize i18n
(async function initI18n() {
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
            updateTestCount();
        });
    });
})();

let currentQ = 0;
let scores = [];
let resultData = null;
let percentValue = 0;

const introScreen = document.getElementById('intro-screen');
const questionScreen = document.getElementById('question-screen');
const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');
const adOverlay = document.getElementById('ad-overlay');

function show(screen) {
    [introScreen, questionScreen, loadingScreen, resultScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// Test count
function getTestCount() {
    return parseInt(localStorage.getItem('hsp_test_count') || '0');
}
function incrementTestCount() {
    const c = getTestCount() + 1;
    localStorage.setItem('hsp_test_count', c.toString());
    updateTestCount();
}
function updateTestCount() {
    const el = document.getElementById('test-count');
    const c = getTestCount();
    if (c > 0) el.textContent = `${c.toLocaleString()} ${i18n.t('testCount')}`;
}
updateTestCount();

// Start
document.getElementById('btn-start').addEventListener('click', () => {
    currentQ = 0;
    scores = [];
    show(questionScreen);
    showQuestion();
    if (typeof gtag === 'function') gtag('event', 'test_start', { event_category: 'hsp_test' });
});

function showQuestion() {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${currentQ + 1} / ${QUESTIONS.length}`;
    document.getElementById('q-text').textContent = q.text;

    const optionsEl = document.getElementById('q-options');
    optionsEl.innerHTML = '';

    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="opt-emoji">${opt.emoji}</span><span class="opt-text">${opt.text}</span>`;
        btn.dataset.score = opt.score;
        btn.addEventListener('click', () => selectOption(btn));
        optionsEl.appendChild(btn);
    });

    const card = document.querySelector('.question-card');
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'slideIn 0.4s ease';
}

function selectOption(btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    btn.classList.add('selected');
    scores.push(parseInt(btn.dataset.score));

    setTimeout(() => {
        currentQ++;
        if (currentQ < QUESTIONS.length) {
            showQuestion();
        } else {
            showLoading();
        }
    }, 400);
}

function showLoading() {
    show(loadingScreen);
    const bar = document.getElementById('loading-fill');
    const text = document.getElementById('loading-text');
    let progress = 0;

    const messages = [
        '감각 민감도 분석 중...',
        '감정 처리 패턴 분석 중...',
        '공감 능력 측정 중...',
        '과자극 반응 분석 중...',
        'HSP 지수 계산 중...'
    ];

    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            bar.style.width = '100%';
            clearInterval(interval);
            setTimeout(() => showResult(), 500);
        } else {
            bar.style.width = progress + '%';
        }
        const msgIdx = Math.min(Math.floor(progress / 20), messages.length - 1);
        text.textContent = messages[msgIdx];
    }, 400);
}

function showResult() {
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const maxScore = QUESTIONS.length * 4;
    percentValue = Math.round((totalScore / maxScore) * 100);

    resultData = getResult(percentValue);
    show(resultScreen);

    // Gauge animation
    const gauge = document.getElementById('gauge-fill');
    const gaugeText = document.getElementById('gauge-percent');
    gauge.style.background = `conic-gradient(${resultData.color} 0deg, ${resultData.color} 0deg, rgba(255,255,255,0.08) 0deg)`;

    setTimeout(() => {
        const deg = (percentValue / 100) * 360;
        gauge.style.background = `conic-gradient(${resultData.color} 0deg, ${resultData.color} ${deg}deg, rgba(255,255,255,0.08) ${deg}deg)`;
        gaugeText.textContent = percentValue + '%';
    }, 300);

    // Result content
    document.getElementById('result-emoji').textContent = resultData.emoji;
    document.getElementById('result-title').textContent = resultData.title;
    document.getElementById('result-subtitle').textContent = resultData.subtitle;
    document.getElementById('result-desc').textContent = resultData.desc;

    const traitsEl = document.getElementById('result-traits');
    traitsEl.innerHTML = resultData.traits.map(t => `<li>${t}</li>`).join('');

    const activitiesEl = document.getElementById('result-activities');
    activitiesEl.innerHTML = resultData.activities.map(a => `<li>${a}</li>`).join('');

    const warningsEl = document.getElementById('result-warnings');
    warningsEl.innerHTML = resultData.warnings.map(w => `<li>${w}</li>`).join('');

    document.getElementById('result-compat').textContent = resultData.compat;

    incrementTestCount();
    if (typeof gtag === 'function') gtag('event', 'test_complete', { event_category: 'hsp_test', event_label: resultData.title, value: percentValue });
}

function getResult(percent) {
    for (const r of RESULTS) {
        if (percent >= r.min && percent <= r.max) return r;
    }
    return RESULTS[RESULTS.length - 1];
}

// Premium
document.getElementById('btn-premium').addEventListener('click', () => {
    adOverlay.classList.add('active');
    let countdown = 5;
    const countEl = document.getElementById('ad-countdown');
    const closeBtn = document.getElementById('ad-close');
    countEl.textContent = countdown;
    closeBtn.style.display = 'none';

    const timer = setInterval(() => {
        countdown--;
        countEl.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(timer);
            closeBtn.style.display = 'block';
        }
    }, 1000);

    if (typeof gtag === 'function') gtag('event', 'premium_click', { event_category: 'hsp_test' });
});

document.getElementById('ad-close').addEventListener('click', () => {
    adOverlay.classList.remove('active');
    displayPremiumContent();
});

function displayPremiumContent() {
    const premiumCard = document.getElementById('premium-content');
    premiumCard.style.display = 'block';

    // Sensitivity radar
    const senseData = getSensitivityAnalysis();
    let radarHTML = '<div class="detail-section"><h3>📊 감각별 민감도 분석</h3><div class="radar-list">';
    senseData.forEach(s => {
        radarHTML += `<div class="radar-item"><span class="radar-label">${s.label}</span><div class="radar-bar-bg"><div class="radar-bar" style="width:${s.value}%;background:${s.color}"></div></div><span class="radar-value">${s.value}%</span></div>`;
    });
    radarHTML += '</div></div>';

    // Recovery tips
    const tips = getRecoveryTips();
    let tipsHTML = '<div class="detail-section"><h3>🧘 과자극 회복 루틴</h3><ul>';
    tips.forEach(t => { tipsHTML += `<li>${t}</li>`; });
    tipsHTML += '</ul></div>';

    // Career suggestions
    const careers = getCareerSuggestions();
    let careerHTML = '<div class="detail-section"><h3>💼 HSP 추천 직업군</h3><ul>';
    careers.forEach(c => { careerHTML += `<li>${c}</li>`; });
    careerHTML += '</ul></div>';

    // Weekly routine
    let routineHTML = '<div class="detail-section"><h3>📅 이번 주 감정 관리 루틴</h3><ul>';
    const routines = [
        '월: 🌅 아침 10분 명상으로 시작',
        '화: 📝 감정 일기 3줄 쓰기',
        '수: 🚶 점심시간 혼자 산책 15분',
        '목: 🎵 좋아하는 음악으로 감정 리셋',
        '금: 🛁 저녁 셀프케어 타임',
        '토: 🌳 자연 속에서 디지털 디톡스',
        '일: 📖 혼자만의 시간으로 에너지 충전'
    ];
    routines.forEach(r => { routineHTML += `<li>${r}</li>`; });
    routineHTML += '</ul></div>';

    premiumCard.innerHTML = radarHTML + tipsHTML + careerHTML + routineHTML;
    premiumCard.scrollIntoView({ behavior: 'smooth' });

    if (typeof gtag === 'function') gtag('event', 'premium_view', { event_category: 'hsp_test' });
}

function getSensitivityAnalysis() {
    // Calculate from specific question scores
    const sound = Math.round(((scores[0] + scores[3]) / 8) * 100);
    const visual = Math.round(((scores[2] + scores[15]) / 8) * 100);
    const touch = Math.round(((scores[7] + scores[12]) / 8) * 100);
    const emotion = Math.round(((scores[1] + scores[4] + scores[10]) / 12) * 100);
    const social = Math.round(((scores[6] + scores[19]) / 8) * 100);

    return [
        { label: '🔊 청각 민감도', value: sound, color: '#e74c3c' },
        { label: '💡 시각 민감도', value: visual, color: '#f39c12' },
        { label: '✋ 촉각 민감도', value: touch, color: '#2ecc71' },
        { label: '💕 감정 민감도', value: emotion, color: '#9b59b6' },
        { label: '👥 사회적 민감도', value: social, color: '#3498db' }
    ];
}

function getRecoveryTips() {
    if (percentValue <= 40) {
        return [
            '가끔 조용한 시간을 가져보세요 - 내면의 목소리에 귀 기울이기',
            '감정 일기를 써보면 자기 이해가 깊어집니다',
            '민감한 사람을 이해하는 연습을 해보세요'
        ];
    } else if (percentValue <= 60) {
        return [
            '하루 중 30분은 혼자만의 조용한 시간을 확보하세요',
            '과자극 신호 (두통, 피로) 감지 시 바로 쉬기',
            '주말에 자연 속에서 감각을 리셋하세요',
            '카페인과 자극적 음식 줄이기'
        ];
    } else {
        return [
            '매일 1시간 이상 혼자만의 시간 확보 (필수!)',
            '소음 차단 이어폰 or 귀마개 항상 소지',
            '과자극 시 5-4-3-2-1 그라운딩 기법 사용',
            '밤 10시 이후 스마트폰 차단 (블루라이트 민감)',
            '주 2회 이상 명상 또는 호흡 운동',
            '"아니오"라고 말하는 연습 - 자기 보호가 최우선'
        ];
    }
}

function getCareerSuggestions() {
    if (percentValue <= 40) {
        return [
            '🏢 경영/관리직 - 스트레스 상황에서 안정적 리더십',
            '🚀 영업/마케팅 - 사교적 환경에서 에너지 발휘',
            '⚡ 스타트업/창업 - 빠른 변화에 유연한 대처',
            '🎤 프레젠테이션/교육 - 사람 앞에 서는 것이 편안'
        ];
    } else if (percentValue <= 60) {
        return [
            '💻 프리랜서/재택근무 - 환경 조절 가능',
            '🎨 디자인/크리에이티브 - 감수성 활용',
            '📊 기획/전략 - 깊은 분석과 직관의 균형',
            '🤝 상담/코칭 - 공감 능력 활용'
        ];
    } else {
        return [
            '✍️ 작가/에디터 - 혼자 깊이 몰입하는 작업',
            '🎨 예술가/음악가 - 풍부한 감수성을 작품으로',
            '🔬 연구원/학자 - 세밀한 관찰과 분석',
            '🌿 치료사/상담사 - 깊은 공감과 치유 능력',
            '📚 사서/큐레이터 - 조용한 환경에서의 전문성'
        ];
    }
}

// Share
document.getElementById('btn-share').addEventListener('click', shareResult);
function shareResult() {
    const text = `🧠 나의 HSP 민감도: ${percentValue}%\n${resultData.emoji} ${resultData.title}\n${resultData.subtitle}\n\n당신도 HSP일까?\n👉 https://dopabrain.com/hsp-test/\n\n#HSP테스트 #민감성테스트 #메타센싱`;
    if (navigator.share) {
        navigator.share({ title: 'HSP 민감성 테스트', text: text, url: 'https://dopabrain.com/hsp-test/' }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => alert('결과가 복사되었습니다!'));
    }
    if (typeof gtag === 'function') gtag('event', 'share', { event_category: 'hsp_test' });
}

// Save image
document.getElementById('btn-save-image').addEventListener('click', generateShareImage);
function generateShareImage() {
    const canvas = document.getElementById('share-canvas');
    const ctx = canvas.getContext('2d');
    const w = 1080, h = 1080;

    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, resultData.color);
    grad.addColorStop(1, resultData.colorEnd || '#0a0a1e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative pattern - soft circles
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(w * Math.random(), h * Math.random(), 150 + Math.random() * 250, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Gauge circle visual (left side)
    const gaugeX = w * 0.15;
    const gaugeY = h * 0.35;
    const gaugeRadius = 60;
    const gaugeFill = (percentValue / 100) * 360;

    // Background circle
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Fill arc
    ctx.fillStyle = resultData.color;
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeRadius, -Math.PI/2, -Math.PI/2 + (gaugeFill * Math.PI / 180), false);
    ctx.lineTo(gaugeX, gaugeY);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Top text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '600 36px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('나의 HSP 민감도는', w / 2, 150);

    // Percentage (large)
    ctx.fillStyle = '#fff';
    ctx.font = '900 180px -apple-system, sans-serif';
    ctx.fillText(percentValue + '%', w / 2, 400);

    // Emoji
    ctx.font = '130px sans-serif';
    ctx.fillText(resultData.emoji, w / 2, 550);

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = '700 56px -apple-system, sans-serif';
    ctx.fillText(resultData.title, w / 2, 650);

    // Subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '400 32px -apple-system, sans-serif';
    ctx.fillText(resultData.subtitle, w / 2, 710);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, 760);
    ctx.lineTo(w * 0.85, 760);
    ctx.stroke();

    // CTA
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '400 28px -apple-system, sans-serif';
    ctx.fillText('당신도 HSP일까? 👇', w / 2, 840);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '400 24px -apple-system, sans-serif';
    ctx.fillText('HSP 민감성 테스트', w / 2, 890);

    // Branding
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '400 22px -apple-system, sans-serif';
    ctx.fillText('🔥 DopaBrain', w / 2, 1020);

    // Download
    const link = document.createElement('a');
    link.download = `HSP_${percentValue}%.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (typeof gtag === 'function') gtag('event', 'save_image', { event_category: 'hsp_test' });
}

// Retry
document.getElementById('btn-retry').addEventListener('click', () => {
    const premiumContent = document.getElementById('premium-content');
    premiumContent.style.display = 'none';
    premiumContent.innerHTML = '';
    show(introScreen);
    updateTestCount();
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
