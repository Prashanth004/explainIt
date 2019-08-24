import '../../../css/TimerBar.css';
import React from 'react'

export default (props) => {

const wordingDiv = (props.value!==100)?(<div>
    <div className="progresDiv" style={{display:"block"}} >
    <div  className="progressInnerBar" style={{width:props.value+"%"}}id="pbar" ></div>
</div>
<span style={{fontSize:"12px"}}>{props.wordings}</span></div>
):(null)
   
  return (
    <div>
      {wordingDiv}
    </div>
  )
}
