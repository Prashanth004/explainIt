import React from 'react';
import './chat.css';

export default (props) => {
    return (
        <div className="rightChat">
            <div >
                <div style={{float:"right"}} >
                    <div style={{ float: "left" }}>
                        <div className="talk-bubble tri-right round right-in">
                            <div class="talktext">
                                {props.chatText}                            
                            </div>
                        </div>
                    </div>
               </div>
            </div>
            <div>
                <div className="avatarPic">
                    <img alt="Adam" height="100%" width="100%" src={require('../../../images/adam.png')} />
                </div>
            </div>
            </div>)
        }
