import React from 'react'
const DwnloadStyle = {
 borderStyle:"solid",
 borderWidth:"1px",
 borderRadius:"4px",
 borderColor:"#ddd",
 width:"380px",
 margin:"auto",
 backgroundColor:"white",
 padding:"20px",
 color:"#333"
}

export default (props) => {
  return (
      <div style={DwnloadStyle}>
                <h5>Please down the chrome extension to continue</h5>
                <button className="buttonLight" onClick={props.downloadExtension}>Download Extension</button>
            </div>
  )
}
