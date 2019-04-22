import React, { Component } from 'react'
import '../../css/profile.css';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import ProfileForm from './ProfileForm';
import {openEditProfile,closeEditProfile} from '../../../actions/profileAction'
import config from '../../../config/config'
import { FiGithub, FiLinkedin, FiEdit, FiTwitter } from "react-icons/fi";
class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenEdit: false
        }
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }
    openEdit() {
       this.props.openEditProfile()
    }
    closeEdit(){
       this.props.closeEditProfile()
    }
    render() {
        const profileConatiner = (!this.props.openEdirProfile)?
        (
            <div>
                <div className="bio">
                    <p><b>Prashanth</b></p>
                    <p>
                       {this.props.bio}
                    </p>
                    <p><b>I charge {this.props.cost}$ a minute</b></p>
                </div>
                <div >
                    <div className="socialIcon"
                    visibility={(this.props.githubLink!==null)?"visible":"hidden"}>
                    <a href={this.props.githubLink}
                    
                    target="_blank">
                        <FiGithub />
                        </a>
                    </div>
                    <div className="socialIcon"
                    visibility={(this.props.linkinLink!==null)?"visible":"hidden"}>
                    <a href={this.props.linkinLink} target="_blank">
                    
                        <FiLinkedin />
                        </a>
                    </div>

                    <div className="socialIcon">
                    <a href={'https://twitter.com/'+this.props.twitterHandle}target="_blank">
                        <FiTwitter />
                    </a>
                    </div>
                </div>
            </div> 
        ):(
            <ProfileForm 
            closeEdit={this.closeEdit}/>
        )
        return (
            <div>
                <div className="profileConatiner">
                <span>
                    <FiEdit onClick={this.openEdit} className="edit" />
                </span>
                    {profileConatiner}
                </div>
            </div>
        )
    }
}
Profile.PropType = {
    openEditProfile:PropType.func.isRequired,
    closeEditProfile:PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName:state.profile.userName,
    cost : state.profile.cost,
    angelLink:state.profile.angelLink,
    githubLink:state.profile.githubLink,
    bio:state.profile.bio,
    linkinLink:state.profile.linkinLink,
    twitterHandle:state.profile.twitterHandle,
    updatingDone:state.profile.doneUpdating,
    updateSuccess : state.profile.updateSuccess,
    openEdirProfile:state.profile.openEdirProfile
})

export default connect(mapStateToProps, {
    openEditProfile,closeEditProfile
})(Profile)



