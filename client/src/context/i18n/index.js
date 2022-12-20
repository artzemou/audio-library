import React, { useState } from "react";
import Context from "./i18n";

const I18nContext = props => {
const [locale, setLocale] = useState('fr');

return (
    <Context.Provider
      value={{
        locale: sessionStorage.getItem("locale") ? sessionStorage.getItem("locale") : locale,
        setLocale
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default I18nContext;