import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { LOCALE } from "../config/i18n/locales";
import { load, selectLocale } from "../config/i18n/localeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks/store";

const AsyncIntlProvider: React.FC = ({ children }) => {
  const locale = LOCALE.ENGLISH;
  const dispatch = useAppDispatch();
  const translation = useAppSelector(selectLocale);

  useEffect(() => {
    import(`../config/i18n/locales/${locale}.json`).then((file) => {
      dispatch(load(file.default));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IntlProvider locale={locale} messages={translation} defaultLocale="en-US">
      {children}
    </IntlProvider>
  );
};

export { AsyncIntlProvider };
