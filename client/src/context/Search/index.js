import React, { useEffect, useState } from 'react'

import Context from './search'
import axios from 'axios'
import {getAllAudioFiles} from "../../dataProvider"

const SearchContext = (props) => {
  const [q, setQ] = useState(sessionStorage.getItem('q')|| '')
  const [documents, setDocuments] = useState([])

  useEffect(() => {
      axios
        .post(process.env.REACT_APP_URI + '/search', {
          q,
          query_by: 'path',
        })
        .then((res) => {

          setDocuments(res.data)
          sessionStorage.setItem("q", q);
        })
        .catch((error) => {
          console.error(error)
        })
  }, [q])

  return (
    <Context.Provider
      value={{
        q,
        setQ,
        documents,
        setDocuments,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default SearchContext
