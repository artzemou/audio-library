import React, { useCallback, useContext, useEffect, useState } from 'react'

import AudioPlayer from "./AudioPlayer";
import SearchContext from "../context/Search/search";
import {getAllAudioFiles} from "../dataProvider"

const Radio = ({}) => {

  const { documents, setDocuments } = useContext(SearchContext);
  const [document, setDocument] = useState(null);

  const audioLibrary = useCallback(async () => {
    setDocuments(await getAllAudioFiles());
  }, []);

  useEffect(() => {
    audioLibrary();
  }, []);

  useEffect(() => {
    random();
    setInterval(() => {
      random();
    }, 1000);
  }, [documents]);

  const random = ()=> {
    setDocument(documents[(Math.random() * documents.length) | 0])
  }
console.log(document)
  return (
    <>
    {document  && (
      <AudioPlayer
       index={"radio"}
       objectURL={document.download_url}
       autoplay
      />

    )}
    </>
  )
}

export default Radio

Radio.defaultProps = {}

Radio.propTypes = {}
