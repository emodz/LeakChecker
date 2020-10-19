import React from 'react'
import './Spinner.scss'

const Spinner = (props) => {
  return (
    <div className={`spinner ${props.name}`}>
      <div className="dot1" />
      <div className="dot2" />
    </div>
  )
}

export default Spinner
