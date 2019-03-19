import React from 'react'
import '../../css/callImage.css'

export default (props) => {
    const burProps = (props.action==="waiting")?
    "profileImageElementCall burImage":
    "profileImageElementCall"
    const loadingAnim = (props.action==="waiting")?
    (<div class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>):
    null
      
  return (
    <div>
        <div className="imageOfPeersDisplay">
                        <div className="callerImage">
                            <div className="profileImageCall">
                                <img className="profileImageElementCall" src={props.callerImageUrl}/>
                            </div>
                        </div>
                        <div className="loader" >
                        {loadingAnim}
                        </div>
                        <div className="recieverImage">
                        <div className="profileImageCall">
                                <img className={burProps} src={props.recieverImageUrl}/>
                            </div>
                        </div>
         </div>
    </div>
  )
}