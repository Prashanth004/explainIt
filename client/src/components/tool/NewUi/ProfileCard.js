import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import './Floater/floater.css';
import { FiLink2} from "react-icons/fi";
import {getAllMessages} from '../../../actions/messageAction'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import config from '../../../config/config'
import { getProfileDetails } from '../../../actions/profileAction';
import '../../css/newlanding.css'
import { FiMail } from "react-icons/fi";

class ProfileCard extends Component {
    constructor(props){
        super(props)
        this.openProfile = this.openProfile.bind(this)
    }
    componentWillMount() {
        console.log("uswrID : ", this.props.userId)
        if (this.props.userId === this.props.profileId)
            this.props.getProfileDetails(this.props.userId, config.SELF)
        else
            this.props.getProfileDetails(this.props.userId, config.VISIT_PROF)
    }
    componentDidMount(){
        this.props.getAllMessages(this.props.userId)
        
    }
    openProfile(){
        window.open("https://twitter.com/"+this.props.twitterHandle, '_blank')
    }
    render() {
        var notifyBadge =null
        if (this.props.userId === this.props.profileId){
            notifyBadge=(<NotificationBadge count={this.props.totalUnread} effect={Effect.ROTATE_Y}/>
            )
        }
        if (this.props.isHome) {
            var linkSymbol = (
                <span className="hint--top" aria-label="Get profile link">
                    <FiLink2 style={{width:"15px",
                    height:"15px", 
                    marginTop:"10px",
                    marginLeft:"10px"}}onClick={this.props.toggleDisplayLink} />
                </span>
            )

        }
        else {
            var linkSymbol = null

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
                    
                        <img src={this.props.profilePic} 
                            // onClick={this.openProfile}
                            onDoubleClick={this.props.openDtailsTab}
                            className="labelProfilePic"></img>
                        
                        </span>
                    </div>

                    <div className="screenShareBtnLabel">
                        <span className="hint--top" aria-label="Share screen!">
                            <img onClick={this.props.shareFullScreenShare} height="100%" width="100%" src={require('../../images/screensharing.png')} />
                        </span>
                    </div>
                    <div className="RecordBtnLabel">
                        <span className="hint--top" aria-label="Record screen!">
                            <img onClick={this.props.recordFullScreen} height="100%" width="100%" src={require('../../images/download.jpg')} />
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







            // <div className="Profilecard">
            //     <div className="blackwhite">
            //         {linkSymbol}
            //     </div>
            //     <div className="profileDetails">
            //         <div className="nameImageDiv">
            //             <div className="profileImage">
            //             <a href={"https://twitter.com/"+this.props.twitterHandle}>
            //                 <img src={this.props.profilePic} onDoubleClick={this.props.openDtailsTab} className="profileImageElement" ></img>
            //                 </a>    
            //             </div>
            //             <div   className="profileName">
            //             <a href={"https://twitter.com/"+this.props.twitterHandle}
            //            ><b>{this.props.userName}</b></a>
            //           </div>

            //         </div>
            //         <div onClick={this.props.toggleCreatedIssue} className="displayNumber">
            //             <p>Created</p>
            //             <p className="numberShow"><a href="#">{this.props.noCreated}</a></p>

            //         </div >
            //         <div onClick={this.props.toggleParticipatedIssue} className="displayNumber">
            //             <p>Participated</p>
            //             <p className="numberShow"><a href="#">{this.props.noParticipated}</a></p>

            //         </div>
            //     </div>
            // </div>
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
                
                    <img src={this.props.profilePic} onClick={this.openProfile}className="labelProfilePic"></img>
                    
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

export default connect(mapStateToProps, {  getAllMessages,getProfileDetails })(ProfileCard)

