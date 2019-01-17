import React from 'react'
import PropTypes from 'prop-types'

export default function Iframe({ videoID, style }) {
  if (!videoID) {
    return null
  }

  return (
    <iframe
      title="Video watcher"
      src={`https://www.youtube.com/embed/${videoID}?autoplay=1`}
      frameBorder={0}
      style={style}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  )
}

Iframe.propTypes = {
  videoID: PropTypes.string,
  style: PropTypes.shape(Object),
}

Iframe.defaultProps = {
  videoID: '',
  style: {},
}
