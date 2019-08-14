import React from 'react'
import {
 FiZap, FiPhoneMissed, FiVideo,
  FiPhoneIncoming, FiUsers, FiCopy, FiUserPlus
} from "react-icons/fi";
import './activity.css'

export default () => {
  return (

    <div className="notionMain" >
      <div>
        <div className="notionBox">
          <div className="notionDiv">
            <div>
              <FiCopy />
            </div>
            <div>
              <p>Screen Share activity</p>
            </div>
          </div>
          <div className="notionDiv">
            <div>
              <FiVideo />
            </div>
            <div>
              <p>Screen Record activity</p>
            </div>
          </div>
          
        </div >
        <div className="notionBox">

          <div className="notionDiv">
            <div>
              <FiUsers />

            </div>
            <div>
              <p>Refer activity</p>

            </div>
          </div>

          <div className="notionDiv">
            <div>
              <FiUserPlus />

            </div>
            <div>
              <p>Added to contacts</p>

            </div>
          </div>


        </div>
      </div>


    </div>

    //              <FiPhoneMissed /><br/>
    // <br/>
    //  <br/>
    // <br/>
    // <br/>





    // <p>Call not answered</p>
    // 
    // 
    // 
    // 

  )
}
