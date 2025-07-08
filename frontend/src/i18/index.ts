import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import eng from "./locales/eng.json"
import ru from "./locales/ru.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    resources: {
      en: { translation: eng },
      ru: { translation: ru },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
