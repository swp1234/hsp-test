(function () {
    'use strict';

    var KEY = 'sensory_load_map_v1';
    var LANGS = ['en', 'ko', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
    var SOURCES = ['hsp_result', 'sensory_reset', 'portal_tools_catalog', 'blog_sensory_bridge'];
    var DOMAINS = ['noise', 'light', 'touch', 'social', 'demands'];
    var LEVELS = { high: 2, medium: 1, low: 0 };
    var ICONS = ['🔊', '☀️', '🧣', '👥', '🔀'];
    var EN = {
        pageTitle: 'Sensory Load Map & Environment Request Card | DopaBrain', skip: 'Skip to map', back: '← HSP self-reflection', language: 'Language',
        eyebrow: 'PRIVATE PREFERENCE MAP · NOT A TEST', title: 'Sensory Load Map', lead: 'Compare five kinds of input, find what deserves attention first, and build a practical environment request card without writing personal details.',
        noScore: 'No score', local: 'Local-only map', copyable: 'Copyable request', noticeTitle: 'Preferences, not a diagnosis', noticeBody: 'This map describes what feels easier or harder today. It cannot identify a condition or determine formal accommodation rights.',
        mapKicker: "MAP TODAY'S LOAD", mapTitle: 'How demanding is each input?', reset: 'Reset', context: 'Environment to plan for', work: 'Work or study', home: 'Home', public: 'Public or travel', social: 'Social time', sleep: 'Rest or bedtime', build: 'Build my map',
        resultKicker: 'YOUR ENVIRONMENT CARD', resultTitle: '{context} sensory load map', summary: 'Start with the highest-load input. One small environment change is enough.', requestTitle: 'Optional request', copy: 'Copy card', used: 'Mark used', usedDone: 'Used today',
        privacy: 'Only level IDs, context and used state stay in this browser. No selection or generated sentence is sent to analytics.', ad: 'Advertisement', methodKicker: 'TWO DIFFERENT TOOLS', methodTitle: 'Plan ahead or reset now', resetCard: '5-Minute Sensory Reset', resetDesc: 'Use when input already feels too strong', hsp: 'HSP Self-Reflection', hspDesc: 'Explore sensitivity patterns without diagnosis', tools: '← All tools', footer: 'Your map stays on this device.',
        low: 'Low', medium: 'Medium', high: 'High', noise: 'Noise', noiseDesc: 'Volume, overlapping voices, sudden sounds', light: 'Light & visuals', lightDesc: 'Brightness, flicker, clutter, movement', touch: 'Touch & body', touchDesc: 'Texture, temperature, clothing, proximity', social: 'Social input', socialDesc: 'Conversation, eye contact, group energy', demands: 'Demands & switching', demandsDesc: 'Instructions, interruptions, task changes',
        built: 'Map ready.', copied: 'Card copied.', copyFail: 'Copy failed.', resetDone: 'Map reset.', marked: 'Marked used.', unmarked: 'Use mark removed.'
    };
    var L = {
        ko: {
            pageTitle: '감각 부하 지도와 환경 요청 카드 | DopaBrain', skip: '지도로 바로가기', back: '← HSP 자기성찰', language: '언어', eyebrow: '비공개 선호 지도 · 테스트 아님', title: '감각 부하 지도',
            lead: '다섯 가지 입력을 비교하고 우선 줄일 자극과 실용적인 환경 요청 문장을 정리하세요. 개인 내용을 쓸 필요가 없습니다.', noScore: '점수 없음', local: '기기 내 저장', copyable: '복사 가능한 요청', noticeTitle: '진단이 아닌 선호 정리', noticeBody: '오늘 무엇이 편하거나 힘든지 정리하는 도구입니다. 상태를 진단하거나 공식 편의 제공 권리를 판단하지 않습니다.',
            mapKicker: '오늘의 부하 지도', mapTitle: '각 입력이 얼마나 부담되나요?', reset: '초기화', context: '계획할 환경', work: '일 또는 공부', home: '집', public: '공공장소 또는 이동', social: '사람들과 보내는 시간', sleep: '휴식 또는 취침', build: '내 지도 만들기',
            resultKicker: '나의 환경 카드', resultTitle: '{context} 감각 부하 지도', summary: '부하가 가장 높은 입력부터 보세요. 작은 환경 변화 하나면 충분합니다.', requestTitle: '선택 요청 문장', copy: '카드 복사', used: '사용 완료 표시', usedDone: '오늘 사용함', privacy: '부하 단계 ID, 환경, 사용 여부만 이 브라우저에 저장됩니다. 선택이나 생성 문장은 분석으로 보내지 않습니다.',
            ad: '광고', methodKicker: '서로 다른 두 도구', methodTitle: '미리 계획하거나 지금 리셋하기', resetCard: '5분 감각 리셋', resetDesc: '이미 자극이 강할 때 사용', hsp: 'HSP 자기성찰', hspDesc: '진단 없이 민감성 패턴 살펴보기', tools: '← 모든 도구', footer: '지도는 이 기기에만 저장됩니다.',
            low: '낮음', medium: '중간', high: '높음', noise: '소음', noiseDesc: '음량, 겹치는 목소리, 갑작스러운 소리', light: '빛과 시각', lightDesc: '밝기, 깜박임, 시각적 복잡함, 움직임', touch: '촉감과 신체', touchDesc: '질감, 온도, 옷, 가까운 거리', social: '사회적 입력', socialDesc: '대화, 시선, 집단 분위기', demands: '요구와 전환', demandsDesc: '지시, 방해, 업무 전환', built: '지도를 만들었습니다.', copied: '카드를 복사했습니다.', copyFail: '복사하지 못했습니다.', resetDone: '초기화했습니다.', marked: '사용 완료로 표시했습니다.', unmarked: '사용 표시를 해제했습니다.'
        },
        zh: {
            pageTitle: '感官负荷地图与环境请求卡 | DopaBrain', skip: '跳到地图', back: '← HSP自我反思', language: '语言', eyebrow: '私人偏好地图 · 不是测试', title: '感官负荷地图', lead: '比较五类刺激，找出最需要先处理的部分，并生成实用的环境请求卡，无需填写个人信息。', noScore: '不计分', local: '仅本机保存', copyable: '可复制请求', noticeTitle: '偏好整理，不是诊断', noticeBody: '此地图只描述今天哪些刺激更轻松或更困难，不能诊断任何状况，也不能判定正式便利安排的权利。',
            mapKicker: '绘制今天的负荷', mapTitle: '每类刺激带来多大负担？', reset: '重置', context: '准备调整的环境', work: '工作或学习', home: '家中', public: '公共场所或出行', social: '社交时间', sleep: '休息或睡前', build: '生成我的地图', resultKicker: '你的环境卡', resultTitle: '{context}感官负荷地图', summary: '先处理负荷最高的刺激。一次做一个小改变就够了。', requestTitle: '可选请求', copy: '复制卡片', used: '标记为已使用', usedDone: '今天已使用', privacy: '只有负荷等级ID、环境和使用状态保存在此浏览器。选择和生成的句子不会发送到分析系统。',
            ad: '广告', methodKicker: '两种不同工具', methodTitle: '提前规划或立即重置', resetCard: '5分钟感官重置', resetDesc: '当刺激已经太强时使用', hsp: 'HSP自我反思', hspDesc: '在不诊断的前提下了解敏感模式', tools: '← 所有工具', footer: '地图只保存在此设备。', low: '低', medium: '中', high: '高', noise: '噪声', noiseDesc: '音量、重叠人声、突发声音', light: '光线与视觉', lightDesc: '亮度、闪烁、杂乱、移动', touch: '触觉与身体', touchDesc: '材质、温度、衣物、距离', social: '社交输入', socialDesc: '交谈、目光接触、群体氛围', demands: '任务与切换', demandsDesc: '指令、打断、任务变化', built: '地图已生成。', copied: '卡片已复制。', copyFail: '复制失败。', resetDone: '地图已重置。', marked: '已标记使用。', unmarked: '已取消使用标记。'
        },
        ja: { pageTitle: '感覚負荷マップと環境リクエストカード | DopaBrain', title: '感覚負荷マップ', lead: '5種類の刺激を比べ、優先する環境調整をカードにまとめます。', build: 'マップを作る' },
        es: { pageTitle: 'Mapa de carga sensorial | DopaBrain', title: 'Mapa de carga sensorial', lead: 'Compara cinco tipos de estímulo y crea una tarjeta práctica de preferencias ambientales.', build: 'Crear mi mapa' },
        pt: { pageTitle: 'Mapa de carga sensorial | DopaBrain', title: 'Mapa de carga sensorial', lead: 'Compare cinco tipos de estímulo e crie um cartão prático de preferências ambientais.', build: 'Criar meu mapa' },
        id: { pageTitle: 'Peta Beban Sensorik | DopaBrain', title: 'Peta Beban Sensorik', lead: 'Bandingkan lima jenis input dan buat kartu permintaan lingkungan yang praktis.', build: 'Buat peta' },
        fr: { pageTitle: 'Carte de charge sensorielle | DopaBrain', title: 'Carte de charge sensorielle', lead: 'Comparez cinq types de stimuli et créez une carte pratique de préférences.', build: 'Créer ma carte' },
        de: { pageTitle: 'Sensorische Belastungskarte | DopaBrain', title: 'Sensorische Belastungskarte', lead: 'Vergleiche fünf Reizarten und erstelle eine praktische Umgebungskarte.', build: 'Karte erstellen' },
        tr: { pageTitle: 'Duyusal Yük Haritası | DopaBrain', title: 'Duyusal Yük Haritası', lead: 'Beş girdi türünü karşılaştırın ve pratik bir ortam kartı oluşturun.', build: 'Harita oluştur' },
        ru: { pageTitle: 'Карта сенсорной нагрузки | DopaBrain', title: 'Карта сенсорной нагрузки', lead: 'Сравните пять типов стимулов и создайте практичную карточку предпочтений.', build: 'Создать карту' },
        hi: { pageTitle: 'संवेदी भार मानचित्र | DopaBrain', title: 'संवेदी भार मानचित्र', lead: 'पाँच तरह के इनपुट की तुलना करें और व्यावहारिक वातावरण कार्ड बनाएँ।', build: 'मानचित्र बनाएँ' }
    };
    var ADVICE = {
        en: { noise: 'Use one quieter zone, reduce overlapping audio, or use a sound barrier when appropriate.', light: 'Reduce glare or motion, simplify the visual field, or choose steadier lighting.', touch: 'Adjust texture, temperature, clothing, or personal distance where possible.', social: 'Add a defined pause, smaller group, written option, or clearer end time.', demands: 'Reduce simultaneous instructions, group similar tasks, and make the next step visible.' },
        ko: { noise: '조용한 구역을 하나 정하거나 겹치는 소리를 줄이고, 필요하면 차음 도구를 사용하세요.', light: '눈부심과 움직임을 줄이고 시야를 단순하게 하거나 안정적인 조명을 고르세요.', touch: '가능한 범위에서 질감, 온도, 옷 또는 사람과의 거리를 조정하세요.', social: '명확한 휴식, 작은 모임, 글로 답할 선택지 또는 종료 시간을 더하세요.', demands: '동시 지시를 줄이고 비슷한 일을 묶은 뒤 다음 한 단계를 보이게 하세요.' },
        zh: { noise: '选择一个更安静的区域，减少重叠声音，必要时使用隔音工具。', light: '减少眩光和移动画面，简化视野，或选择更稳定的照明。', touch: '在可行范围内调整材质、温度、衣物或人与人的距离。', social: '安排明确的暂停、小组、书面选项或清晰的结束时间。', demands: '减少同时出现的指令，合并相似任务，并让下一步清楚可见。' }
    };
    var REQUEST = {
        en: { work: 'Could we reduce {domain} for this block so I can focus on the next task?', home: 'I am adjusting {domain} for a while, then I will check what I can do next.', public: 'I need a lower-{domain} option or a short pause before continuing.', social: 'I would like less {domain} and a clear end time so I can stay present.', sleep: 'I am lowering {domain} now and will return to the rest tomorrow.' },
        ko: { work: '다음 일에 집중할 수 있도록 이 시간에는 {domain} 자극을 줄일 수 있을까요?', home: '잠시 {domain} 자극을 조절한 뒤 다음에 할 수 있는 일을 확인할게요.', public: '계속하기 전에 {domain} 자극이 적은 선택지나 짧은 휴식이 필요합니다.', social: '함께 머물 수 있도록 {domain} 자극을 줄이고 종료 시간을 정하고 싶어요.', sleep: '지금은 {domain} 자극을 낮추고 나머지는 내일 다시 하겠습니다.' },
        zh: { work: '为了专注于下一项任务，这段时间可以减少{domain}刺激吗？', home: '我会先调整一会儿{domain}刺激，然后再看下一步能做什么。', public: '继续之前，我需要一个{domain}刺激更低的选项或短暂休息。', social: '为了能继续参与，我想减少{domain}刺激并明确结束时间。', sleep: '我现在会降低{domain}刺激，其余的明天再处理。' }
    };

    var params = new URLSearchParams(location.search);
    var lang = normalizeLanguage(params.get('lang') || navigator.language || 'en');
    var source = normalizeSource(params.get('source'));
    var state = loadState();
    var toastTimer;

    function normalizeLanguage(value) {
        value = String(value).toLowerCase().split('-')[0];
        return LANGS.includes(value) ? value : 'en';
    }
    function normalizeSource(value) { return SOURCES.includes(value) ? value : 'direct'; }
    function updateUrl() {
        var url = new URL(location.pathname, location.origin);
        url.searchParams.set('lang', lang);
        if (source !== 'direct') url.searchParams.set('source', source);
        history.replaceState({}, '', url.pathname + url.search + location.hash);
    }
    function strings() { return Object.assign({}, EN, L[lang] || {}); }
    function text(key, values) {
        var value = strings()[key] || EN[key] || key;
        Object.keys(values || {}).forEach(function (name) { value = value.replace('{' + name + '}', values[name]); });
        return value;
    }
    function defaultLevels() { return Object.fromEntries(DOMAINS.map(function (id) { return [id, 'medium']; })); }
    function normalizeState(value) {
        var result = value && typeof value === 'object' ? value : {};
        result.levels = Object.assign(defaultLevels(), result.levels || {});
        return result;
    }
    function loadState() {
        try { return normalizeState(JSON.parse(localStorage.getItem(KEY) || '{}')); }
        catch (error) { return normalizeState({}); }
    }
    function saveState() { try { localStorage.setItem(KEY, JSON.stringify({ levels: state.levels, context: state.context, used: !!state.used })); } catch (error) {} }
    function hasSavedState() { try { return !!localStorage.getItem(KEY); } catch (error) { return false; } }
    function track(name, data) {
        if (typeof gtag === 'function') gtag('event', name, Object.assign({ event_category: 'engagement', surface_name: 'sensory_load_map', content_locale: lang, revenue_goal: 'daily_0_10' }, data || {}));
    }
    function showToast(message) {
        var element = document.getElementById('toast');
        element.textContent = message;
        element.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { element.classList.remove('show'); }, 2000);
    }
    function renderDomains() {
        var box = document.getElementById('domains');
        box.textContent = '';
        DOMAINS.forEach(function (id, index) {
            var row = document.createElement('div'); row.className = 'domain';
            var copy = document.createElement('div');
            var name = document.createElement('strong'); name.textContent = ICONS[index] + ' ' + text(id);
            var desc = document.createElement('small'); desc.textContent = text(id + 'Desc');
            copy.append(name, desc);
            var levels = document.createElement('div'); levels.className = 'levels';
            levels.setAttribute('role', 'group'); levels.setAttribute('aria-label', text(id));
            ['low', 'medium', 'high'].forEach(function (level) {
                var button = document.createElement('button');
                button.type = 'button'; button.dataset.domain = id; button.dataset.level = level; button.textContent = text(level);
                button.setAttribute('aria-label', text(id) + ': ' + text(level));
                button.setAttribute('aria-pressed', String(state.levels[id] === level));
                levels.append(button);
            });
            row.append(copy, levels); box.append(row);
        });
    }
    function renderResult() {
        var ranked = DOMAINS.slice().sort(function (a, b) { return LEVELS[state.levels[b]] - LEVELS[state.levels[a]]; });
        var top = ranked.slice(0, 3);
        var box = document.getElementById('priorities');
        var result = document.getElementById('result');
        result.hidden = false; result.classList.toggle('used', !!state.used);
        document.getElementById('resultTitle').textContent = text('resultTitle', { context: text(state.context || 'work') });
        document.getElementById('summary').textContent = text('summary'); box.textContent = '';
        top.forEach(function (id, index) {
            var item = document.createElement('article'); item.className = 'priority';
            var number = document.createElement('span'); number.textContent = String(index + 1);
            var copy = document.createElement('div');
            var name = document.createElement('strong'); name.textContent = text(id) + ' · ' + text(state.levels[id]);
            var advice = document.createElement('small'); advice.textContent = (ADVICE[lang] || ADVICE.en)[id];
            copy.append(name, advice); item.append(number, copy); box.append(item);
        });
        var template = (REQUEST[lang] || REQUEST.en)[state.context || 'work'];
        document.getElementById('requestText').textContent = template.replace('{domain}', text(top[0]).toLowerCase());
        document.getElementById('used').textContent = state.used ? text('usedDone') : text('used');
    }
    function applyLanguage() {
        document.documentElement.lang = lang; document.title = text('pageTitle');
        document.querySelectorAll('[data-t]').forEach(function (element) { element.textContent = text(element.dataset.t); });
        document.getElementById('language').value = lang;
        document.querySelector('link[rel=canonical]').href = 'https://dopabrain.com/hsp-test/map.html' + (lang === 'en' ? '' : '?lang=' + lang);
        document.getElementById('reset-card-link').href = 'reset.html?lang=' + encodeURIComponent(lang) + '&source=sensory_map';
        document.getElementById('hsp-check-link').href = './?lang=' + encodeURIComponent(lang) + '&source=sensory_map';
        renderDomains(); if (state.context) renderResult();
    }

    document.getElementById('domains').addEventListener('click', function (event) {
        var button = event.target.closest('button[data-domain]'); if (!button) return;
        state.levels[button.dataset.domain] = button.dataset.level; renderDomains();
    });
    document.getElementById('build').addEventListener('click', function () {
        state.context = document.getElementById('context').value; state.used = false; saveState(); renderResult();
        track('sensory_map_generate', { domain_count: 5 }); showToast(text('built'));
        requestAnimationFrame(function () {
            document.getElementById('resultTitle').focus({ preventScroll: true });
            document.getElementById('result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        });
    });
    document.getElementById('reset').addEventListener('click', function () {
        state = normalizeState({}); try { localStorage.removeItem(KEY); } catch (error) {} document.getElementById('context').value = 'work'; document.getElementById('result').hidden = true; renderDomains();
        track('sensory_map_reset'); showToast(text('resetDone'));
    });
    document.getElementById('used').addEventListener('click', function () {
        state.used = !state.used; saveState(); renderResult(); track(state.used ? 'sensory_map_mark_used' : 'sensory_map_mark_reopened'); showToast(text(state.used ? 'marked' : 'unmarked'));
    });
    document.getElementById('copy').addEventListener('click', function () {
        var value = [document.getElementById('resultTitle').textContent].concat(Array.from(document.querySelectorAll('.priority')).map(function (item) { return item.textContent; }), [text('requestTitle') + ': ' + document.getElementById('requestText').textContent]).join('\n');
        navigator.clipboard.writeText(value).then(function () { track('sensory_map_copy'); showToast(text('copied')); }).catch(function () { showToast(text('copyFail')); });
    });
    document.getElementById('language').addEventListener('change', function (event) {
        lang = normalizeLanguage(event.target.value); try { localStorage.setItem('app_language', lang); } catch (error) {} updateUrl(); applyLanguage(); track('sensory_map_language_change', { selected_language: lang });
    });

    if (state.context) document.getElementById('context').value = state.context;
    updateUrl();
    applyLanguage();
    track('sensory_map_view', { has_saved_map: hasSavedState(), source: source });
})();
