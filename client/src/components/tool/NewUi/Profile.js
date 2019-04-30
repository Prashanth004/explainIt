import React, { Component } from 'react'
import '../../css/profile.css';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import ProfileForm from './ProfileForm';
import {openEditProfile,closeEditProfile} from '../../../actions/profileAction'
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
        const editOption = (this.props.isHome)?( <span>
            <FiEdit onClick={this.openEdit} className="edit" />
        </span>):(null)
        const bio =(this.props.bio!==null)?(
            (this.props.bio.length>0)?(
                <p>
                       {this.props.bio}
                    </p>
            ):(null)
        ):(null)

        const goodAtDiv = (this.props.goodat!==null)?(
            (this.props.goodat.length>0)?(
                <div>
                <span><b>I am good at</b></span>
                <p>{this.props.goodat}</p>
                </div>
            ):(null)
        ):(null)


        const worksDiv =(this.props.works!==null)?(
            (this.props.works.length>0)?(
                <div>
                <span><b>My works</b></span>
                                    <p>{this.props.works}</p>
                </div>
            ):(null)
        ):(null)
        const profileConatiner = (!this.props.openEdirProfile)?
        (
            <div>
                <div className="bio">
                    <p><b>{this.props.userName}</b></p>
                    {bio}
                   {goodAtDiv}
                   {worksDiv}
                    {/* <p><b>I charge {this.props.cost}$ a minute</b></p> */}
                </div>
                <div >
                    <div className="socialIcon"
                    style={{visibility:((this.props.githubLink!==null)?((this.props.githubLink.length!==0)?"visible":"hidden"):"hidden")}}>
                    <a href={this.props.githubLink}
                    rel="noopener noreferrer"
                    target="_blank">
                        <FiGithub />
                        </a>
                    </div>
                    <div className="socialIcon"
                    style={{visibility:((this.props.linkinLink!==null)?((this.props.linkinLink.length!==0)?"visible":"hidden"):"hidden")}}>
                    <a href={this.props.linkinLink} rel="noopener noreferrer" target="_blank">
                    
                        <FiLinkedin />
                        </a>
                    </div>

                    <div className="socialIcon">
                    <a href={'https://twitter.com/'+this.props.twitterHandle}
                    rel="noopener noreferrer"
                    target="_blank">
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
                {editOption}
               
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
    openEdirProfile:state.profile.openEdirProfile,
    goodat:state.profile.goodat,
    works:state.profile.works
})

export default connect(mapStateToProps, {
    openEditProfile,closeEditProfile
})(Profile)



