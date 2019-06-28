import React from 'react';
import { MdFilterNone } from "react-icons/md";


export default (props) => {
  const {floaterDisplay,shareMyscreen}= props
  return  (floaterDisplay==='block')?(<div>
    <div>
        <span className="hint--bottom" aria-label="Share my screen">
            <MdFilterNone onClick={shareMyscreen} className="endButtonFloat1" />
        </span>
    </div>
</div>):null
}
