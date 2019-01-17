import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input } from 'react-form-uncontrolled'
import Header from './components/Header'
import Iframe from './components/Iframe'
import useCamaraPoses from './hooks/useCamaraPoses';

import './assets/styles/app.css'

const VIDEO_DEFAULT = '_fVBFE2xw7U'

export default function App(){
  const [videoID, setVideoID] = useState(VIDEO_DEFAULT)
  const onBrowse = useCallback(({ id }) => setVideoID(id), [])
  const { videoElement, poses } = useCamaraPoses()

  console.log({ poses })

  return (
    <>
      <Header title="Running Stabilizer">
        <Form onSubmit={onBrowse}>
          <Input 
            name="id"
            type="text"
            required
            placeholder={`Introduce a youtube video ID (ex: ${VIDEO_DEFAULT})`}
          />
          <button 
            className="browse" 
            type="submit"
          >
            Go
          </button>
        </Form>
      </Header>
      <video className="video" playsInline ref={videoElement} />
      <Iframe videoID={videoID} />
    </>
  )
}
