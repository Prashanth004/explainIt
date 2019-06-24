import React from 'react';
import './activity.css';
import config from '../../../../config/config'

export default (props) => {
  return (
      <span className="hint--top" aria-label={"@"+props.name}>
        <a href={config.react_url+"/@"+props.name} target="_blank" rel="noopener noreferrer">
          <img className="profIconImg" alt={props.name}src={props.imgsrc}/>
          </a>
      </span>
  )
}
