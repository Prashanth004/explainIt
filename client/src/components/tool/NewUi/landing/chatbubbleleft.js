import React from 'react';
import './chat.css';

export default (props) => {
    return (<div className="leftChat">
        <div>
            <div className="avatarPic">
                <img alt="Adam" height="100%" width="100%" src={require('../../../images/admin1.png')} />
            </div>
        </div>
        <div>
            <div >
                <div style={{ float: "left" }}>
                    <div className="talk-bubble tri-right round left-in">
                        <div class="talktext">
                        {props.chatText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    )
}
