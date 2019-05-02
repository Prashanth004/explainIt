import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {cancelSuccess} from '../../../actions/issueActions';
import './Floater/floater.css';
import { FiLink2} from "react-icons/fi";
import {getAllMessages,JustRecord} from '../../../actions/messageAction'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import config from '../../../config/config'
import {setIssueIdToNull} from '../../../actions/issueActions'
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'
import { FiMail } from "react-icons/fi";
import { cancelAllMessageAction } from '../../../actions/messageAction'
import { restAllToolValue } from "../../../actions/toolActions";
import { resetValues } from '../../../actions/twitterApiAction'


class ProfileCard extends Component {
    constructor(props){
        super(props)
        this.openProfile = this.openProfile.bind(this);
        this.startSharingScreen = this.startSharingScreen.bind(this);
        this.startRecordScreen = this.startRecordScreen.bind(this);
        }
    componentWillMount() {
        if (this.props.userId === this.props.profileId)
            this.props.getProfileDetails(this.props.userId, config.SELF)
        else
            this.props.getProfileDetails(this.props.userId, config.VISIT_PROF)
            this.props.getAllMessages(this.props.userId)
        }
    startRecordScreen(){
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.JustRecord();
        this.props.setIssueIdToNull();
        this.props.cancelSuccess();
        this.props.recordFullScreen();
    }
    startSharingScreen(){
        this.props.cancelAllMessageAction();
        this.props.restAllToolValue();
        this.props.resetValues();
        this.props.cancelSuccess();
        this.props.shareFullScreenShare()
    }
    openProfile(){
        window.open("https://twitter.com/"+this.props.twitterHandle, '_blank')
    }
    render() {
        var linkSymbol =null;
        var notifyBadge =null
        if (this.props.userId === this.props.profileId){
            notifyBadge=(<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y}/>
            )
        }
        if (this.props.isHome) {
            linkSymbol = (
                <span className="hint--top" aria-label="Get profile link">
                    <FiLink2 style={{width:"15px",
                    height:"15px", 
                    float:"right",
                    marginTop:"0px",
                    marginRight:"10px"}}onClick={this.props.toggleDisplayLink} />
                </span>
            )
        }
        else {
            linkSymbol = null
        }
        return (this.props.isHome)?(
            <div>
                <div className="labelContainer">
                <div className="topSymbol">
                <span>
                            {linkSymbol}
                        </span>
                </div>
                <div className="gridLay">
                    <div className="pImageContainer">
                    <span className="hint--top" aria-label={this.props.userName}>
                        <img alt="profile pic"src={this.props.profilePic} 
                            onDoubleClick={this.props.openDtailsTab}
                            className="labelProfilePic"></img>
                        </span>
                    </div>
                    <div className="screenShareBtnLabel">
                        <span className="hint--top" aria-label="Share screen!">
                            <img alt="screen share" onClick={this.startSharingScreen} height="100%" width="100%" src={require('../../images/screensharing.png')} />
                        </span>
                    </div>
                    <div className="RecordBtnLabel">
                        <span className="hint--top" aria-label="Record screen!">
                            <img alt="record screen" onClick={this.startRecordScreen} height="100%" width="100%" src={require('../../images/download.jpg')} />
                        </span>
                    </div>
                    <div className="drago">
                    <div >
                        {notifyBadge}
                        <span>
                            <FiMail onClick={this.props.toggleInbox} className="dragoMail" />
                        </span>
                    </div>
                       
                    </div>
                    <div>
                       
                    </div>
                    </div>
                </div>

            </div>

        ):(
            <div>
                
            <div className="labelContainerView">
            <div className="topSymbol">
            <span>
                        {linkSymbol}
                    </span>
            </div>
            <div className="gridLayViewPage">
                <div className="pImageContainer">
                <span className="hint--top" aria-label={this.props.userName}>
                
                    <img alt=" "src={this.props.profilePic}  onDoubleClick={this.props.openDtailsTab}className="labelProfilePic"></img>
                    
                    </span>
                </div>
                <div className="drago">
                <div >
                    {notifyBadge}
                    <span>
                        <FiMail onClick={this.props.toggleInbox} className="dragoMail" />
                    </span>
                </div>
                   
                </div>
                <div>
                   
                </div>
                </div>
            </div>

        </div>

        )
    }
}

ProfileCard.PropType = {
    toggleProjects: PropType.func.isRequired,
    getProfileDetails: PropType.func.isRequired,
    getAllMessages:PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName: state.profile.userName,
    totalUnread:state.message.totalInboxNumber,
    email: state.profile.email,
    profilePic: state.profile.profilePic,
    noCreated: state.profile.noCreated,
    noParticipated: state.profile.noParticipated,
    profileId: state.auth.id,
    twitterHandle: state.profile.twitterHandle,
})

export default connect(mapStateToProps, { JustRecord,
    setIssueIdToNull,cancelSuccess,cancelAllMessageAction,
    resetValues,restAllToolValue,
     getAllMessages,getProfileDetails })(ProfileCard)

