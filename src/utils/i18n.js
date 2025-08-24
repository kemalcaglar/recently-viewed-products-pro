import tr from '../locales/tr.js'
import en from '../locales/en.js'

// Desteklenen diller
const SUPPORTED_LANGUAGES = {
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷',
    locale: tr
  },
  en: {
    name: 'English',
    flag: '🇺🇸',
    locale: en
  }
}

// Varsayılan dil
const DEFAULT_LANGUAGE = 'tr'

class I18nManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || DEFAULT_LANGUAGE
    this.translations = SUPPORTED_LANGUAGES[this.currentLanguage].locale
  }

  // Dil değiştir
  setLanguage(language) {
    if (SUPPORTED_LANGUAGES[language]) {
      this.currentLanguage = language
      this.translations = SUPPORTED_LANGUAGES[language].locale
      this.storeLanguage(language)
      return true
    }
    return false
  }

  // Mevcut dili al
  getCurrentLanguage() {
    return this.currentLanguage
  }

  // Desteklenen dilleri al
  getSupportedLanguages() {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => ({
      code,
      name: lang.name,
      flag: lang.flag
    }))
  }

  // Çeviri al
  t(key, params = {}) {
    const keys = key.split('.')
    let value = this.translations

    // Nested key'leri takip et
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    // String değilse key'i döndür
    if (typeof value !== 'string') {
      return key
    }

    // Parametreleri değiştir
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match
    })
  }

  // Dil seçimi için localStorage
  storeLanguage(language) {
    try {
      localStorage.setItem('widget_language', language)
    } catch (error) {
      console.warn('Could not store language preference:', error)
    }
  }

  // localStorage'dan dil al
  getStoredLanguage() {
    try {
      return localStorage.getItem('widget_language')
    } catch (error) {
      console.warn('Could not retrieve language preference:', error)
      return null
    }
  }

  // Sistem dilini algıla
  detectSystemLanguage() {
    const systemLang = navigator.language || navigator.userLanguage
    const shortLang = systemLang.split('-')[0]

    if (SUPPORTED_LANGUAGES[shortLang]) {
      return shortLang
    }

    return DEFAULT_LANGUAGE
  }

  // Dil değişikliklerini dinle
  onLanguageChange(callback) {
    this.languageChangeCallbacks = this.languageChangeCallbacks || []
    this.languageChangeCallbacks.push(callback)
  }

  // Dil değişikliğini bildir
  notifyLanguageChange() {
    if (this.languageChangeCallbacks) {
      this.languageChangeCallbacks.forEach(callback => callback(this.currentLanguage))
    }
  }
}

// Global instance
const i18n = new I18nManager()

// Utility fonksiyonlar
export const t = (key, params) => i18n.t(key, params)
export const setLanguage = (language) => {
  const success = i18n.setLanguage(language)
  if (success) {
    i18n.notifyLanguageChange()
  }
  return success
}
export const getCurrentLanguage = () => i18n.getCurrentLanguage()
export const getSupportedLanguages = () => i18n.getSupportedLanguages()
export const detectSystemLanguage = () => i18n.detectSystemLanguage()

export default i18n
