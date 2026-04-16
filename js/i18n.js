class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'ja', 'es', 'pt', 'zh', 'id', 'tr', 'de', 'fr', 'hi', 'ru'];
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) return urlLang;

        const savedLang = localStorage.getItem('app_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) return savedLang;

        const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
        if (this.supportedLanguages.includes(browserLang)) return browserLang;

        return 'en';
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error('Locale not found');
            this.translations[lang] = await response.json();
            return true;
        } catch (error) {
            if (lang !== 'en') return this.loadTranslations('en');
            return false;
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const segment of keys) {
            if (value && value[segment] !== undefined) {
                value = value[segment];
            } else {
                return key;
            }
        }

        return value;
    }

    getSeoHref(lang) {
        const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
        const hrefMap = {};

        links.forEach((link) => {
            const hreflang = link.getAttribute('hreflang');
            if (hreflang) hrefMap[hreflang] = link.href;
        });

        return hrefMap[lang] || hrefMap['x-default'] || (document.querySelector('link[rel="canonical"]') || {}).href || window.location.href;
    }

    syncSeoState(lang, updateHistory = false) {
        const currentUrl = new URL(window.location.href);
        const currentHasLangParam = currentUrl.searchParams.has('lang');
        const targetHref = this.getSeoHref(updateHistory || currentHasLangParam ? lang : 'x-default');

        if (targetHref) {
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) canonical.href = targetHref;

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.content = targetHref;

            const twitterUrl = document.querySelector('meta[name="twitter:url"]');
            if (twitterUrl) twitterUrl.content = targetHref;
        }

        if (updateHistory && targetHref) {
            const nextUrl = new URL(targetHref);
            nextUrl.hash = currentUrl.hash;
            if (currentUrl.pathname !== nextUrl.pathname || currentUrl.search !== nextUrl.search || currentUrl.hash !== nextUrl.hash) {
                window.history.replaceState({}, '', nextUrl.pathname + nextUrl.search + nextUrl.hash);
            }
        }
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) return false;
        if (!this.translations[lang]) await this.loadTranslations(lang);

        this.currentLang = lang;
        localStorage.setItem('app_language', lang);
        document.documentElement.lang = lang;
        this.updateUI();
        this.syncSeoState(lang, true);
        return true;
    }

    updateUI() {
        document.documentElement.lang = this.currentLang;

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const value = this.t(key);
            if (value === key) return;

            if (element.hasAttribute('data-i18n-attr')) {
                element.setAttribute(element.getAttribute('data-i18n-attr'), value);
            } else {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            element.placeholder = this.t(element.getAttribute('data-i18n-placeholder'));
        });

        const title = this.t('meta.title');
        if (title !== 'meta.title') document.title = title;

        const description = this.t('meta.description');
        const meta = document.querySelector('meta[name="description"]');
        if (meta && description !== 'meta.description') meta.content = description;

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title !== 'meta.title') ogTitle.content = title;

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && description !== 'meta.description') ogDescription.content = description;

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle && title !== 'meta.title') twitterTitle.content = title;

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription && description !== 'meta.description') twitterDescription.content = description;

        this.syncSeoState(this.currentLang);
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            ko: '한국어',
            en: 'English',
            ja: '日本語',
            es: 'Español',
            pt: 'Português',
            zh: '中文',
            id: 'Bahasa Indonesia',
            tr: 'Türkçe',
            de: 'Deutsch',
            fr: 'Français',
            hi: 'हिन्दी',
            ru: 'Русский'
        };
        return names[lang] || lang;
    }
}

try {
    window.i18n = new I18n();
} catch (error) {
    console.warn('i18n init failed:', error);
}
