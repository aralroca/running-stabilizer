import React, {
  useState, useCallback, useMemo,
} from 'react'
import { Form, Input } from 'react-form-uncontrolled'
import Header from './components/Header'
import Iframe from './components/Iframe'
import useCamaraPoses from './hooks/useCamaraPoses'

import './assets/styles/app.css'

const VIDEO_DEFAULT = '_fVBFE2xw7U'
const CENTER = 150

function getStyles(poses) {
  const { position = {}, score } = poses ? poses.keypoints[0] : {}

  if (!score || score < 0.5) {
    position.x = CENTER
    position.y = CENTER
  }

  return {
    marginTop: position.y === CENTER
      ? 40
      : 40 - ((position.y - CENTER) * 50) / CENTER,
  }
}

export default function App() {
  const [videoID, setVideoID] = useState(VIDEO_DEFAULT)
  const onBrowse = useCallback(({ id }) => setVideoID(id), [])
  const { videoElement, poses } = useCamaraPoses()

  // Get nose poses
  const style = useMemo(() => getStyles(poses), [poses])

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
      <video
        className="video"
        playsInline
        ref={videoElement}
      />
      <Iframe
        videoID={videoID}
        style={style}
      />
    </>
  )
}
