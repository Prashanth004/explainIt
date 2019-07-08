import React from 'react'

export default (props) => {
    var minutes = Math.floor(props.time);
    minutes = (minutes<10) ? "0"+minutes : minutes;
    var seconds = Math.floor((props.time - Math.floor(props.time))* 60)
    seconds = (seconds<10) ? "0"+seconds : seconds;
  return (<span>{minutes}:{seconds}</span>)
}
