import React, { useCallback, useContext, useEffect, useState } from "react";

import AudioPlayer from "./AudioPlayer";
import SearchContext from "../context/Search/search";
import {getAllAudioFiles} from "../dataProvider"
import { v4 as uuidv4 } from "uuid";

function AudioLibrary() {
  const { documents, setDocuments } = useContext(SearchContext);

  const audioLibrary = useCallback(async () => {
    setDocuments(await getAllAudioFiles());
  }, []);

  useEffect(() => {
    audioLibrary();
  }, []);
  console.log(documents)

  return (
    <>
        {documents && documents.length === 0 && (
          <>
            <div>No result</div>
          </>
        )}
        {documents && documents.length > 0 && (
          <>
            <ul className="audio-library">
              {documents.length > 0 &&
                documents.map((record, i) => {
                  return (
                    <li key={uuidv4()}>
                      <div>
                        <a href={`/audio-library/${record.document?.path || record.path}`}>
                          <span>{record.document?.name || record.name}</span>
                          <i className="material-icons">link</i>
                        </a>
                      </div>

                      <AudioPlayer
                        index={i}
                        objectURL={record.document?.download_url || record.download_url}
                      />
                    </li>
                  );
                })}
            </ul>
          </>
        )}
    </>
  );
}

export default AudioLibrary;
