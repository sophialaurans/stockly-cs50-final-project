import React, { createContext, useState, useEffect, useContext } from "react";
import { IntlProvider } from "react-intl";
import messages_en from "./i18n/en.json";
import messages_pt from "./i18n/pt.json";
import { getLocales } from "expo-localization";

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const deviceLanguage = (getLocales()[0]?.languageCode?.split('-')[0]) || "pt";
    const [locale, setLocale] = useState(deviceLanguage);

    const messages = {
        en: messages_en,
        pt: messages_pt,
    };

    return (
        <LanguageContext.Provider value={{ locale }}>
            <IntlProvider locale={locale} messages={messages[locale]}>
                {children}
            </IntlProvider>
        </LanguageContext.Provider>
    );
};

export { LanguageProvider };
