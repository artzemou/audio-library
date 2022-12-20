import React, { useCallback, useContext, useState } from "react";

import SearchContect from "../context/Search/search";
import { T } from 'react-polyglot-hooks';
import { audioTypes } from "./audioTools"
import { navigate } from "hookrouter";
import { uploadAudioFiles } from "../dataProvider"
import { useDropzone } from "react-dropzone";

// To do:  traduction
export default function Upload() {
  const [percentLoaded, setPercentLoaded] = useState(0);
  const { setDocuments } = useContext(SearchContect);

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setPercentLoaded(`${percentCompleted}%`);
  }


  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      var formData = new FormData();

      for (var i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        formData.append("uploads[]", file, file.name.toLowerCase());
      }

      const {data} = await uploadAudioFiles(formData, onUploadProgress)
      setDocuments(data)
      navigate(`/audio-library`)
    }
  }, []);

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    // accept: audioTypes,
    onDrop,
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    console.log(file, errors)
    switch (errors[0].code) {
      case "file-invalid-type":
        return <T key={"upload.messages.invalidType"} phrase="upload.messages.invalidType" interpolations={{ type: Object.values(audioTypes) }}/>;
      case "file-too-large":
        return <T phrase="upload.messages.tooLarge" />;
    }
    return (
      <li key={file.path}>
        <ul>
          {errors.map(e => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    )
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragAccept && (<p>All files will be accepted</p>)}
      {isDragReject && (<p>Some files will be rejected</p>)}
      {isDragActive ? (
        <>
          <p>Drop the files here ...</p>
        </>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      <div
        style={{
          height: 20,
          width: percentLoaded,
          backgroundColor: "blue",
          transition: "width 500ms linear",
        }}
      ></div>
      <aside>
        <ul>{acceptedFileItems}</ul>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </div>
  );
}
