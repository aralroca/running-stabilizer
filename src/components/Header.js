import React from 'react'
import PropTypes from 'prop-types'

import '../assets/styles/header.css'

export default function Header({ title, children }) {
  return (
    <header>
      <h1>{title}</h1>
      <div className="header-content">{children}</div>
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

Header.defaultProps = {
  title: '',
  children: null,
}
