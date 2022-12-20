import React, { useContext } from "react";

import I18nContext from "../context/i18n/i18n";

export default function LocaleSelect() {
  const { setLocale } = useContext(I18nContext);

  return (
    <>
      <button
        onClick={() => {
          setLocale("fr");
          sessionStorage.setItem("locale", "fr");
        }}
      >
        fr
      </button>
      <button
        onClick={() => {
          setLocale("en");
          sessionStorage.setItem("locale", "en");
        }}
      >
        en
      </button>
    </>
  );
}
