import { useState, useEffect, useRef } from 'react'

/**
 * Use Camara Poses - Hook
 *
 * @param {object} options
 * @return {object} { videoElement, poses } - videoElement is the ref of the video,
 * and poses the object returned by the model posenet
 */
export default function useCamaraPoses(
  {
    milliseconds = 50,
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

  useEffect(() => {
    let timeout
    let video

    /**
     * Setup Camara
     *
     * @description Prepare the camara to record the user
     */
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

    /**
     * Play the video after setup the camara
     */
    async function loadVideo() {
      const videoLoaded = await setupCamera()

      videoLoaded.play()

      return videoLoaded
    }

    /**
     * Capture a video frame and save the poses of that frame
     */
    async function capture() {
      if (!videoElement || !videoElement.current) {
        timeout = setTimeout(capture, milliseconds)
        return
      }

      if (!video && videoElement && videoElement.current) {
        video = await loadVideo()
      }

      setPoses(await net.estimateSinglePose(
        video,
        imageScaleFactor,
        flipHorizontal,
        outputStride,
      ))

      timeout = setTimeout(capture, milliseconds) // reset
    }

    /**
     * Did update
     */
    if (videoElement && videoElement.current && net) {
      timeout = setTimeout(capture, milliseconds)
    }

    /**
     * Will unmount
     */
    return () => clearTimeout(timeout)
  }, [videoElement, net])

  /**
  * Did mount
  */
  useEffect(() => {
    async function initModel() {
      const posenet = await import('@tensorflow-models/posenet')

      setNet(await posenet.load(weight))
    }

    initModel()
  }, [])

  /**
   * Output of the hook
   */
  return { videoElement, poses }
}
