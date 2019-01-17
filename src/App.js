import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Form, Input } from 'react-form-uncontrolled'
import Header from './components/Header'
import Iframe from './components/Iframe'

import './assets/styles/app.css'

import('@tensorflow-models/posenet')

const VIDEO_DEFAULT = '_fVBFE2xw7U'
const MILLISECONDS = 500
const weight = 0.5
const imageScaleFactor = 0.5
const outputStride = 16
const flipHorizontal = true
const maxVideoSize = 300
let timeout
let video

export default function App(){
  const [net, setNet] = useState()
  const videoElement = useRef(null)
  const [videoID, setVideoID] = useState(VIDEO_DEFAULT)
  const onBrowse = useCallback(({ id }) => setVideoID(id), [])

  useEffect(() => {
    async function setupCamera(){
      videoElement.current.width = maxVideoSize
      videoElement.current.height = maxVideoSize
    
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          'audio': false,
          'video': {
            facingMode: 'user',
            width:  maxVideoSize,
            height: maxVideoSize
          }
        })
        videoElement.current.srcObject = stream
    
        return new Promise(resolve => {
          videoElement.current.onloadedmetadata = () => {
            resolve(videoElement.current)
          }
        })
      } else {
        const errorMessage = "This browser does not support video capture, or this device does not have a camera"
        alert(errorMessage)
        return Promise.reject(errorMessage)
      }
    }

    async function loadVideo(){
      const video = await setupCamera()
  
      video.play()
    
      return video
    }

    async function capture(){
        if(!videoElement || !net){
          timeout = setTimeout(capture, MILLISECONDS)
          return
        }
    
        if(!video && videoElement){
           video = await loadVideo()
        }
    
        const poses = await net
          .estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride)
    
        console.log({ poses })
    
        timeout = setTimeout(capture, MILLISECONDS)
    }

    async function init(){
        const posenet = await import('@tensorflow-models/posenet')
        const net = await posenet.load(weight)
        
        setNet(net)
    }

    if(videoElement && net) {
      timeout = setTimeout(capture, MILLISECONDS)
    } else {
      init()
    }
    return () => clearTimeout(timeout)
  }, [videoElement, net])


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
