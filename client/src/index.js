import './index.css'

import * as serviceWorker from './serviceWorker'

import App from './App'
import AuthContext from './context/Auth/index'
import I18nContext from './context/i18n/index'
import React from 'react'
import ReactDOM from 'react-dom'
import SearchContext from './context/Search/index'

ReactDOM.render(
  <>
    <I18nContext>
      <AuthContext>
        <SearchContext>
          <App />
        </SearchContext>
      </AuthContext>
    </I18nContext>
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
