import { translations } from './translations.js';

const supported = ['en', 'zh', 'ko', 'es', 'pt', 'ja', 'ru', 'th'];
const langNames = {
  en: 'English',
  zh: '中文',
  ko: '한국어',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  ru: 'Русский',
  th: 'ไทย',
};

let current = 'en';
let ready = false;

function getValue(obj, key) {
  return key
    .split('.')
    .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

export function t(key, fallback = '') {
  const dict = translations[current] || {};
  const value = getValue(dict, key);
  if (value !== undefined && value !== '') return value;
  if (current !== 'en') {
    const enValue = getValue(translations['en'] || {}, key);
    if (enValue !== undefined && enValue !== '') return enValue;
  }
  return fallback || key;
}

export function setLanguage(lang) {
  if (!supported.includes(lang)) return;
  current = lang;
  document.documentElement.lang = lang;
  updatePage();
  localStorage.setItem('bblb-lang', lang);
}

export function getLanguage() {
  return current;
}

export function getSupportedLanguages() {
  return supported;
}

export function getLanguageName(lang) {
  return langNames[lang] || lang;
}

function updateElement(el) {
  const key = el.dataset.i18n;
  if (!key) return;
  const value = t(key);
  if (el.hasAttribute('placeholder')) {
    el.placeholder = value;
    return;
  }
  if (el.hasAttribute('title')) {
    el.title = value;
    return;
  }
  if (el.tagName === 'META') {
    if (
      el.getAttribute('name') === 'description' ||
      el.getAttribute('property')
    ) {
      el.content = value;
    }
    return;
  }
  if (el.tagName === 'TITLE') {
    el.textContent = value;
    return;
  }
  el.textContent = value;
}

export function updatePage() {
  if (!ready) return;
  document.querySelectorAll('[data-i18n]').forEach(updateElement);
  document.dispatchEvent(
    new CustomEvent('i18n:updated', { detail: { lang: current } }),
  );
}

export function initI18n() {
  const saved = localStorage.getItem('bblb-lang');
  const browser = navigator.language?.slice(0, 2).toLowerCase();
  let start = 'en';
  if (saved && supported.includes(saved)) {
    start = saved;
  } else if (supported.includes(browser)) {
    start = browser;
  }

  current = start;
  document.documentElement.lang = current;
  ready = true;
  updatePage();
}

export { supported };
export default {
  t,
  setLanguage,
  getLanguage,
  getSupportedLanguages,
  getLanguageName,
  updatePage,
  initI18n,
};
