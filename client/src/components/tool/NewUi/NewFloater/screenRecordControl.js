import React from 'react'
import { MdCallEnd } from "react-icons/md";
import Countdown from 'react-countdown-now';
import config from '../../../../config/config';
import './record.css'


const state = {callTabid:null}

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
      return (null)
  } else {
      return <span>{hours}:{minutes}:{seconds}</span>;
  }
};
const endCallFloater = ()=>{
  var msg = null
  msg = {
      'type': config.END_RECORD_FROM_FLOATER,
      'data': {
         
      }
  };
  console.log("posting messages from floater")
window.parent.postMessage(msg, "*");

}
export default (props) => {
  state.callTabid = props.callTabid;

  return (
    <div>
       <div className="floaterContainerTans">
                <div className="callImageDivAnwserMain Share record">

                    <div className="callPage-recieverImageDiv">
                        <span>
                            <MdCallEnd
                                className="img__overlayFloat"
                                onClick={endCallFloater}
                                style={{
                                    padding: "10px"
                                }} />
                        </span>
                    </div>
                    <div>

</div>
                    <div fontSize="13px" style={{ color: "white" , marginTop:"10px"}}>
                        <Countdown
                            date={Date.now() + props.timeAloted * 60 * 1000}
                            renderer={renderer}
                        />
                    </div>

                </div>
            </div>
      
    </div>
  )
}
