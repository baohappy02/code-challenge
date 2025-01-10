import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import dayjs from "dayjs";
import { LANGUAGE } from "./enums/language.enum";
import { KEY_LANGUAGE } from "./constants/localStorage.constant";
import i18n from "i18next";
import Backend from "i18next-http-backend";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const savedLanguage = localStorage.getItem(KEY_LANGUAGE) || LANGUAGE.EN;
dayjs.locale(savedLanguage);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: savedLanguage,
    fallbackLng: "en",
    supportedLngs: ["en", "vi", "ur", "th"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // Disable suspense
    },
    // Use the custom backend
    backend: {
      loadPath: () =>
        new Promise((resolve) => {
          // fake delay
          setTimeout(() => resolve(`${BASE_URL}/translations`), 0);
        }),

      parse: (data: string, language: string) => {
        const jsonData = JSON.parse(data);

        return jsonData.data[language] || jsonData.data[LANGUAGE.EN] || {};
      },
    },
    returnEmptyString: false,
  });

export default i18n;
