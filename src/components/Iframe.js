import React from 'react'
import PropTypes from 'prop-types'

export default function Iframe({ videoID }) {
  if (!videoID) {
    return null
  }

  return (
    <iframe
      title="Video watcher"
      src={`https://www.youtube.com/embed/${videoID}`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}

Iframe.propTypes = {
  videoID: PropTypes.string,
}

Iframe.defaultProps = {
  videoID: '',
}
