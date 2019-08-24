import React, { Component } from 'react'
import '../../css/profile.css';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { hideProfile } from '../../../actions/ProfileCardAction';
import PropType from 'prop-types';
import ProfileForm from './Profile/';
import CopyToClipboard from './container/copyToClipBoard'
import { openEditProfile, closeEditProfile, getProfileVideoLink } from '../../../actions/profileAction'
import { FiEdit,FiEdit2, FiLink2, FiLink } from "react-icons/fi";
import axios from 'axios';
import config from '../../../config/config'
class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenEdit: false,
            openBasicFill: false,
            showDetails: false,
            openLink: false,
            works: [],
            portFolioLink: null
        }
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.toggleProfile = this.toggleProfile.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.portfolio) {
            var works = (nextProps.portfolio).split(" ");
            works = works.filter(element => element !== "");
            this.setState({ works: works });
            var portfolioLinkLoc = works.filter(element => element.includes('portfolio'));
            if (portfolioLinkLoc.length !== 0) {
                this.props.getProfileVideoLink(portfolioLinkLoc[0].split('/')[4])
            }
    
        }

    }
    componentWillMount() {
        const self = this;
        var works = (this.props.portfolio).split(" ");
        works = works.filter(element => element !== "");
        this.setState({ works: works });
        var portfolioLinkLoc = works.filter(element => element.includes('portfolio'));
        if (portfolioLinkLoc.length !== 0) {
            this.props.getProfileVideoLink(portfolioLinkLoc[0].split('/')[4])
        }

        if ((this.props.bio === null || (this.props.bio).length === 0) && this.props.isHome)
            this.setState({ openBasicFill: true });
    }
    toggleProfile() {
        this.setState({ openLink: !this.state.openLink })
    }
    openEdit() {
        this.props.openEditProfile()
    }

    closeEdit() {
        this.props.closeEditProfile()
    }
    render() {
        console.log("this.state.portFolioLink : ", this.state.portFolioLink)
        const videoDiv = this.props.profileVidoeLink !== null ?
            (<div>
                <video src={this.props.profileVidoeLink} width="100%" style={{ borderRadius: "5px", borderStyle:"solid",borderWidth:"1px", borderColor:"#43a8ac",marginTop:"15px" }} controls></video>
            </div>) : (null)
        const links = this.state.works.map(work => (<span><a href={work}>{work}</a> </span>));

        const linkDiv = (this.state.openLink) ? (<div>
          
            <CopyToClipboard sharablelink={this.props.sharabeLink} />
        </div>
        ) : (null)
        const editbtn = (this.props.openEdirProfile || this.props.bio.length === 0) ? (null) : (<span className="hint--top edit" aria-label="Edit!">
          
        </span>)
        const FiLinkDiv = (this.props.openEdirProfile || this.props.bio.length === 0) ? (null) : (<span className="hint--top edit" aria-label="Profile Link">
            <FiLink2 onClick={this.toggleProfile} className="edit" />
        </span>)

        const editOption = (this.props.isHome) ? (
            <div className="topProfileDiv">
                <Button style={{ margin: "-8px" }} close onClick={this.props.hideProfile} />


            </div>) : (<div className="topProfileDiv">
                <Button style={{ margin: "-8px" }} close onClick={this.props.hideProfile} />

            </div>)
        const bio = (this.props.bio !== null) ? (
            (this.props.bio.length > 0) ? (
                <div className="infoSection">
                    <p><b>{this.props.userName}</b>, {this.props.bio}</p>
                </div>
            ) : (null)
        ) : (null)

        const goodAtDiv = (this.props.goodat !== null) ? (
            (this.props.goodat.length > 0) ? (<span><b>I am good at</b> {this.props.goodat}</span>) : (null)
        ) : (null)


        const worksDiv = (this.props.portfolio !== null) ? (
            (this.props.portfolio.length > 0) ? (
                <div className="infoSection">
                    <p><b>My works</b> : {links}</p>
                </div>
            ) : (null)
        ) : (null)
        const profileConatiner = (!this.props.openEdirProfile) ?
            ((this.props.bio.length === 0 && this.props.isHome) ?
                (<div style={{ width: "90%", margin: "auto" }}>
                    <p style={{ fontWeight: "550" }}>Hi <a href={'https://twitter.com/' + this.props.twitterHandle} rel="noopener noreferrer" target="_blank">{this.props.userName}</a>. Help people to know who you are. Write a short note about yourself.</p>

                    <button className="buttonLight" onClick={this.openEdit}>Okay</button>
                </div>) :
                (<div style={{ backgroundColor: "white"}}>
                    <div className="bio" style={{ marginBottom: "20px" }}>
                      
                        <div style={{ textAlign: "center" }}>
                            <h5>{<b>{this.props.userName}</b>} <span  className="hint--top" aria-label="Edit Profile">  
                                <FiEdit2 onClick={this.openEdit} style={{ fontSize: "12px" }} /></span>  <span  className="hint--top" aria-label="Display link">
                                    <FiLink onClick={this.toggleProfile}
                                style={{ fontSize: "12px" }} /></span> </h5>
                                  {linkDiv}
                          
                            <p style={{textAlign:"left", fontSize:"12px",marginTop:"15px"}}>{this.props.bio}<br/>{goodAtDiv}</p>
                            {/* <p style={{textAlign:"left", fontSize:"12px"}}></p> */}
                          
                           
                            {videoDiv}
                         
                        </div>
                        {/* {bio} */}
                        {/* {goodAtDiv} */}
                        {/* {worksDiv}
                        {linkDiv} */}
                    </div>
                    <div style={{ width: "20px", margin: "auto", textAlign: "center" }}>
                        {editbtn}

                    </div>
                    <div >

                    </div>
                </div>)) :
            (<ProfileForm
                closeEdit={this.closeEdit} />
            )
        return (
            <div style={{ minHeight: "140px", borderStyle: "none", textAlign: "center" }}>
                <div className="profileConatinerMain" style={{ borderStyle: "none" }}>
                    {editOption}
                    {/* {onlyClose} */}
                    {profileConatiner}
                </div>
            </div>
        )
    }
}
Profile.PropType = {
    openEditProfile: PropType.func.isRequired,
    closeEditProfile: PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName: state.profile.userName,
    cost: state.profile.cost,
    angelLink: state.profile.angelLink,
    githubLink: state.profile.githubLink,
    bio: state.profile.bio,
    linkinLink: state.profile.linkinLink,
    twitterHandle: state.profile.twitterHandle,
    updatingDone: state.profile.doneUpdating,
    updateSuccess: state.profile.updateSuccess,
    openEdirProfile: state.profile.openEdirProfile,
    goodat: state.profile.goodat,
    portfolio: state.profile.portfolio,
    profileVidoeLink: state.profile.profileVidoeLink
})

export default connect(mapStateToProps, {
    openEditProfile, closeEditProfile, hideProfile,
    getProfileVideoLink
})(Profile)




