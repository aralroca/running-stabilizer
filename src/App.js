import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input } from 'react-form-uncontrolled'
import Header from './components/Header'
import Iframe from './components/Iframe'

import './assets/styles/app.css'

export default function App(){
  const [url, setUrl] = useState('')
  const onBrowse = useCallback((newUrl) => setUrl(newUrl), [])

  useEffect(() => {
    if(url){
      console.log('TODO: Prediction here', url)
    }
  }, [url])

  return (
    <>
      <Header title="Running Stabilizer">
        <Form onSubmit={onBrowse}>
          <Input 
            name="url"
            type="text"
            required
            placeholder="Introduce an url"
          />
          <button 
            className="browse" 
            type="submit"
          >
            Browse
          </button>
        </Form>
      </Header>
      <Iframe url={url} />
    </>
  )
}
