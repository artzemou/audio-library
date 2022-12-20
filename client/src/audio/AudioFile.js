import { Field, Form, Formik } from 'formik'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  deleteAudioFile,
  getAudioFile,
  uploadAudioFile,
  uploadAudioFiles,
} from '../dataProvider'

import AudioPlayer from './AudioPlayer'
import { T } from 'react-polyglot-hooks'
import { load } from 'dotenv'
import { navigate } from 'hookrouter'

function AudioFile({ path }) {
  const [loading, setLoading] = useState(true)
  const [audioFile, setAudioFile] = useState(null)
  const [percentLoaded, setPercentLoaded] = useState(0)

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setPercentLoaded(`${percentCompleted}%`)
  }

  const updateAudioFile = async (newName) => {
    if (audioFile && newName) {
      const { file, formData } = await getAudioFile(
        audioFile.download_url,
        newName
      )
      console.log(file, formData)
      // deleteAudioFile(audioFile.sha, audioFile.path);
      const response = await uploadAudioFiles(formData, onUploadProgress)
      console.log(response.data)
      const path = response.data[0]['path']
      navigate(`/audio-library/${path}`)
    }
  }

  const document = async (path) => {
    const document = await uploadAudioFile(path)
    if (document) {
      setAudioFile(document)
      setLoading(false)

      return
    }
    setAudioFile(null)
    setLoading(false)
  }

  useEffect(() => {
    if (path) {
      document(path)
    }
  }, [path])

  console.log(audioFile)

  return (
    <>
      {!audioFile && !loading && <T phrase='errors.404' />}
      {audioFile && !loading && (
        <>
          <h2>
            <span>{audioFile.name}</span>
            <a href={audioFile.download_url}>
              <span className='material-icons'>download</span>
            </a>
            <a href=''>
              {' '}
              <i className='material-icons'>attach_file</i>
            </a>
          </h2>
          <AudioPlayer index={1} objectURL={audioFile.download_url} />

          <Formik
            initialValues={{
              newName: '',
            }}
            onSubmit={async (values) => {
              updateAudioFile(values.newName)
            }}
          >
            <Form>
              <button
                onClick={async () => {
                  const response = await deleteAudioFile(
                    audioFile.sha,
                    audioFile.path
                  )

                  if (response.status === 200) {
                    navigate(`/audio-library`)
                  } else {
                    console.log(response)
                  }
                }}
              >
                <span className='material-icons-outlined'>delete</span>
              </button>
              <label htmlFor='email'>Modifier le nom</label>
              <Field
                id='newName'
                name='newName'
                placeholder='newName'
                type='text'
              />

              <button type='submit'>Submit</button>
            </Form>
          </Formik>
        </>
      )}
    </>
  )
}

export default AudioFile
