import { useState, useEffect, useRef } from 'react'

import('@tensorflow-models/posenet')

let video

export default function useCamaraPoses(
  {
    milliseconds = 500,
    weight = 0.5,
    imageScaleFactor = 0.5,
    outputStride = 16,
    flipHorizontal = true,
    maxVideoSize = 300,
  } = {},
) {
  const videoElement = useRef(null)
  const [poses, setPoses] = useState()
  const [net, setNet] = useState()
  const [debounce, setDebounce] = useState()

  useEffect(() => {
    async function setupCamera() {
      videoElement.current.width = maxVideoSize
      videoElement.current.height = maxVideoSize

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            width: maxVideoSize,
            height: maxVideoSize,
          },
        })
        videoElement.current.srcObject = stream

        return new Promise(resolve => {
          videoElement.current.onloadedmetadata = () => {
            resolve(videoElement.current)
          }
        })
      }
      const errorMessage = 'This browser does not support video capture, or this device does not have a camera'
      alert(errorMessage)
      return Promise.reject(errorMessage)
    }

    async function loadVideo() {
      const videoLoaded = await setupCamera()

      videoLoaded.play()

      return videoLoaded
    }

    async function capture() {
      if (!videoElement || !net) {
        setDebounce(setTimeout(capture, milliseconds))
        return
      }

      if (!video && videoElement) {
        video = await loadVideo()
      }

      setPoses(await net.estimateSinglePose(
        video,
        imageScaleFactor,
        flipHorizontal,
        outputStride,
      ))

      setDebounce(setTimeout(capture, milliseconds))
    }

    async function init() {
      const posenet = await import('@tensorflow-models/posenet')

      setNet(await posenet.load(weight))
    }

    if (videoElement && net) {
      setDebounce(setTimeout(capture, milliseconds))
    } else {
      init()
    }
    return () => clearTimeout(debounce)
  }, [videoElement, net])

  return { videoElement, poses }
}
