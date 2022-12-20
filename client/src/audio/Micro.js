import * as WaveSurfer from 'wavesurfer.js'

import React, { useEffect, useState } from 'react'

import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone.min.js'
import PropTypes from 'prop-types'
import { uploadAudioFiles } from '../dataProvider'
import { v4 as uuidv4 } from 'uuid'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
let context, processor

if (isSafari) {
  // Safari 11 or newer automatically suspends new AudioContext's that aren't
  // created in response to a user-gesture, like a click or tap, so create one
  // here (inc. the script processor)
  let AudioContext = window.AudioContext || window.webkitAudioContext
  context = new AudioContext()
  processor = context.createScriptProcessor(1024, 1, 1)
}

const Micro = ({}) => {
  const [micro, setMicro] = useState(null)
  const [percentLoaded, setPercentLoaded] = useState(0)
  const [recording, setRecording] = useState(false)
  const [blob, setBlob] = useState(null)
  const [records, setRecords] = useState([])

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.floor(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setPercentLoaded(`${percentCompleted}%`)
  }

  useEffect(() => {
    if (micro) {

      micro.on('deviceError', (code) => {
        console.warn('Device error: ' + code)
      })

      micro.on('deviceReady', () => console.log('start'))

      micro.on('deviceReady', (stream) => {
        setRecording(true)

        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()

        const audioChunks = []

        mediaRecorder.addEventListener('dataavailable', ({ data }) => {
          audioChunks.push(data)
        })

        mediaRecorder.addEventListener('stop', async () => {
          setRecording(false)
          const blob = new Blob(audioChunks)
          setBlob(blob)
        })
      })

      micro.on('finish', () => {
        console.log('finish')
      })
    }
  }, [micro, blob])

  const save = async () => {
    const file = new File([blob], uuidv4(), {
      type: 'audio/wav',
      lastModified: new Date().getTime(),
    })
    const formData = new FormData()

    formData.append(
      'uploads[]',
      file,
      file.name.toLowerCase() + '.' + file.type.split('/').pop()
    )

    const {data} = await uploadAudioFiles(formData, onUploadProgress)
    setRecords([...records, data.shift()])
    setBlob(null)
  }

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: '#micro',
      responsive: true,
      height: 128,
      normalize: true,
      backgroundColor: 'hsla(0, 0%, 95%, 1)',
      waveColor: 'rgba(0,0,0,1)',
      progressColor: 'hsla(250, 99%, 40%, 1)',
      cursorColor: 'rgba(0,0,0,.2)',
      audioContext: context || null,
      audioScriptProcessor: processor || null,
      plugins: [
        MicrophonePlugin.create({
          bufferSize: 4096,
          numberOfInputChannels: 1,
          numberOfOutputChannels: 1,
          constraints: {
            video: false,
            audio: true,
          },
        }),
      ],
    })
    setMicro(wavesurfer.microphone)
  }, [])

  return (
    <>
      <div id='micro'></div>
      <button
        className={'btn'}
        onClick={() => (!recording ? micro.start() : micro.stopDevice())}
      >
        {!recording ? 'Record' : 'Stop'}
      </button>
      {blob && (
        <button className={'btn'} onClick={() => save()}>
          Save
        </button>
      )}

      {Boolean(records.length) && (<div>Record saved</div>)}
      {records.map(record=> <a key={record.path} href={`/audio-library/${record.path}`}><span>{record.path}</span></a>)}
    </>
  )
}

export default Micro

Micro.defaultProps = {}

Micro.propTypes = {}
