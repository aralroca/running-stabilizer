import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input } from 'react-form-uncontrolled'
import Header from './components/Header'
import Iframe from './components/Iframe'

import './assets/styles/app.css'

const VIDEO_DEFAULT = '_fVBFE2xw7U'
export default function App(){
  const [videoID, setVideoID] = useState(VIDEO_DEFAULT)
  const onBrowse = useCallback(({ id }) => setVideoID(id), [])

  useEffect(() => {
    if(videoID){
      console.log('TODO: Prediction here', videoID)
    }
  }, [videoID])

  return (
    <>
      <Header title="Running Stabilizer">
        <Form onSubmit={onBrowse}>
          <Input 
            name="url"
            type="text"
            required
            placeholder={`Introduce a youtube video ID (ex: ${VIDEO_DEFAULT})`}
          />
          <button 
            className="browse" 
            type="submit"
          >
            Start
          </button>
        </Form>
      </Header>
      <Iframe videoID={videoID} />
    </>
  )
}
