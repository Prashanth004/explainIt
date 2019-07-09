import React from 'react';
import './record.css';
import Countdown from 'react-countdown-now';


export default (props) => {
const {addExtraMinute,renderer,ReducedMinute,floaterTime} = props;
  return (<div className="timeDiv caller">
  <div className="addTimer add"><span className="tmeBtns" onClick={addExtraMinute}>+</span></div>
  <div style={{textAlign:'center'}}>
      <Countdown
          date={Date.now() + floaterTime * 60 * 1000}
          renderer={renderer}
      />
  </div>
  <div className="addTimer sub"><span className="tmeBtns" onClick={ReducedMinute}>-</span></div>
</div>)

// (
//   <div className="timeDiv">
//       <div style={{textAlign:"center"}}>
//       <Countdown
//           date={Date.now() + floaterTime * 60 * 1000}
//           renderer={renderer}
//       />
//       </div>
//   </div>
// )
}
