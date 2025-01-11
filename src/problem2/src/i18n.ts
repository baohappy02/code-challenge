import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import dayjs from "dayjs";
import { LANGUAGE } from "./enums/language.enum";
import { KEY_LANGUAGE } from "./constants/localStorage.constant";
import i18n from "i18next";
import Backend from "i18next-http-backend";

const savedLanguage = localStorage.getItem(KEY_LANGUAGE) || LANGUAGE.EN;
dayjs.locale(savedLanguage);

const DETECTION_OPTIONS = {
  order: ["htmlTag", "cookie", "localStorage", "path", "subdomain"],
  caches: ["localStorage"],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: LANGUAGE.EN,
    supportedLngs: ["en", "vi", "ur", "th"] as LANGUAGE[],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Disable suspense
    },
    // Use the custom backend
    detection: DETECTION_OPTIONS,
    backend: {
      loadPath: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve("/translations.json"), 250),
        ),
      crossDomain: true,
      parse: (data: any, language: string) => {
        const parseData = JSON.parse(data);
        return parseData[language] || parseData[LANGUAGE.EN] || {};
      },
    },
    returnEmptyString: false,
  });

export default i18n;
