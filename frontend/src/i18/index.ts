import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import en from "./locales/en.json"
import ru from "./locales/ru.json"
import ko from "./locales/ko.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    supportedLngs: ["en", "ru", "ko"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ko: { translation: ko },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
