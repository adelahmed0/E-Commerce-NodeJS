import i18next from "i18next";
import middleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";

const configureI18n = () => {
  i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: "en",
      backend: { loadPath: "locales/{{lng}}.json" },
    });

  return i18next;
};

export default configureI18n;
