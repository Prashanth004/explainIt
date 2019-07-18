import React from 'react'

export default (props) => {
  return (
      <div className="messageToDownload">
                <h3>Please down the chrome extension to continue</h3>
                <button className="buttonDark" onClick={props.downloadExtension}>Download Extension</button>
            </div>
  )
}
