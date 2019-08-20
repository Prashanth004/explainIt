import React, { Component } from 'react'
import '../../css/profile.css';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { hideProfile } from '../../../actions/ProfileCardAction';
import PropType from 'prop-types';
import ProfileForm from './Profile/';
import CopyToClipboard from '../CopytoClipboard'
import { openEditProfile, closeEditProfile } from '../../../actions/profileAction'
import { FiEdit, FiLink2 } from "react-icons/fi";
class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenEdit: false,
            openBasicFill: false,
            showDetails: false,
            openLink: false,
            works: []
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
        }

    }
    componentWillMount() {
        var works = (this.props.portfolio).split(" ");
        works = works.filter(element => element !== "");
        this.setState({ works: works })
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


        const links = this.state.works.map(work => (<span><a href={work}>{work}</a> </span>));

        const linkDiv = (this.state.openLink) ? (<div>
            <span><b>My sharable Profile Link</b></span>
            <CopyToClipboard sharablelink={this.props.sharabeLink} />
        </div>
        ) : (null)
        const editbtn = (this.props.openEdirProfile || this.props.bio.length === 0) ? (null) : (<span className="hint--top edit" aria-label="Edit!">
            <FiEdit onClick={this.openEdit} className="edit" />
        </span>)
        const FiLink = (this.props.openEdirProfile || this.props.bio.length === 0) ? (null) : (<span className="hint--top edit" aria-label="Profile Link">
            <FiLink2 onClick={this.toggleProfile} className="edit" />
        </span>)
        // const onlyClose = (!this.props.isHome) ? (<div className="topBtnsActivity">
        //     <Button style={{ margin: "-8px" }} close onClick={this.props.hideProfile} />
        // </div>) : (null)
        const editOption = (this.props.isHome) ? (
            <div className="topProfileDiv">
                <Button style={{ margin: "-8px" }} close onClick={this.props.hideProfile} />
                <div style={{ width: "70px", display: "grid", gridTemplateColumns: "50% 50%" }}>
                    {editbtn}
                    {FiLink}
                </div>

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
            (this.props.goodat.length > 0) ? (
                <div className="infoSection">
                    <p><b>I am good at</b> {this.props.goodat}</p>
                </div>
            ) : (null)
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
                (<div style={{ width: "80%", margin: "auto" }}>
                    <p style={{ fontWeight: "550" }}>Hi <a href={'https://twitter.com/' + this.props.twitterHandle} rel="noopener noreferrer" target="_blank">{this.props.userName}</a>. Help people to know who you are. Write a short note about yourself.</p>

                    <button className="buttonLight" onClick={this.openEdit}>Okay</button>
                </div>) :
                (<div style={{ backgroundColor: "white" }}>
                    <div className="bio">
                        <br />
                        {bio}
                        {goodAtDiv}
                        {worksDiv}
                        {linkDiv}
                    </div>
                    <div >

                    </div>
                </div>)) :
            (<ProfileForm
                closeEdit={this.closeEdit} />
            )
        return (
            <div style={{ minHeight: "240px", borderStyle: "none", textAlign: "center" }}>
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
    portfolio: state.profile.portfolio
})

export default connect(mapStateToProps, {
    openEditProfile, closeEditProfile, hideProfile,
})(Profile)




