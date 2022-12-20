import './scss/_app.scss'

import { I18n, T } from 'react-polyglot-hooks'
import React, { useContext, useEffect, useState } from 'react'
import { usePath, useRoutes } from 'hookrouter'

import I18nContext from './context/i18n/i18n'
import Nav from './router/Nav'
import SearchBar from './components/SearchBar'
import SearchContext from './context/Search/search'
import { Transition } from 'react-transition-group';
import phrases from './translations'
import routes from './router/router'
import { v4 as uuidv4 } from 'uuid'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
  justifyContent: 'center'
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
};

const App = () => {
  const routeResult = useRoutes(routes)

  const { locale } = useContext(I18nContext)
  const { q, setQ, documents, setDocuments } = useContext(SearchContext)
  const [inProp, setInProp] = useState(false);
  const currentPath = usePath();
  useEffect(() => {
    // Do something with currentPath
    console.log(currentPath)
    setInProp(true)
  }, [currentPath]);

  console.log(inProp)
  return (
    <I18n locale={locale} phrases={phrases[locale]}>
      <>
        <header className='Header'>
          <Nav/>
          <section>
            <SearchBar
              setDocuments={setDocuments}
              setQ={setQ}
            ></SearchBar>
            {q && documents.length === 0 && (
              <>
                <div>No result</div>
              </>
            )}
            {q && documents.length > 0 && (
              <>
                <ul>
                  {documents.length > 0 &&
                    documents.map((record, i) => {
                      return (
                        <li key={uuidv4()}>
                          <a href={`/audio-library/${record.path}`}>
                            {record.name}
                          </a>
                        </li>
                      )
                    })}
                </ul>
              </>
            )}
          </section>
        </header>
        <Transition in={inProp} timeout={duration}>
          {state => (
            <div style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              {routeResult || <T phrase='errors.404' />}
            </div>
          )}
        </Transition>
      </>
    </I18n>
  )
}

export default App
