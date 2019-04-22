import React, { Component } from 'react'
import '../../css/ProfileForm.css'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {closeEditProfile, updateUserProfile } from '../../../actions/profileAction'
class ProfileForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // this.state.linkedInValue
            bioValue: null,
            linkedInValue: null,
            gitHubValue: null,
            angelListValue: null,
            costValue: null,
            costError: false,
            bioValueError: false,
            linkInerror: false,
            gitHibError: false,
            angelListError: false,
            saveClicked: false
        }
        this.changeBio = this.changeBio.bind(this);
        this.changeLinkedIn = this.changeLinkedIn.bind(this);
        this.changeGithub = this.changeGithub.bind(this);
        this.changeAngelList = this.changeAngelList.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.updateCost = this.updateCost.bind(this);
    }
    componentDidMount() {
        this.setState({
            bioValue: this.props.bio,
            linkedInValue: this.props.linkinLink,
            gitHubValue: this.props.githubLink,
            angelListValue: this.props.angelLink,
            costValue: this.props.cost,
        })
    }
    changeBio(e) {
        this.setState({
            bioValue: e.target.value,
            bioValueError: null
        })
        if (this.state.bioValue !== null) {
            if (this.state.bioValue.length > 200) {
                this.setState({
                    bioValueError: "cant exceed more than 200"
                })
            }
        }
    }
    updateCost(e) {
        this.setState({
            costValue: e.target.value
        })
    }
    changeLinkedIn(e) {
        this.setState({
            linkedInValue: e.target.value,
            linkInerror: null
        })
    }
    changeGithub(e) {
        // alert(this.state.gitHubValue)
        this.setState({
            gitHubValue: e.target.value,
            gitHibError: null
        })
    }

    changeAngelList(e) {
        this.setState({
            angelListValue: e.target.value,
            angelListError: null
        })
    }
    uploadData() {
        
            if (!this.state.linkedInValue.includes('www.linkedin.com')
            && !this.state.linkedInValue!==null) {
                this.setState({
                    linkInerror: true
                })
            }
    
        else if (!this.state.gitHubValue.includes('github.com')
        && !this.state.gitHubValue!==null) {
                this.setState({
                    gitHibError: true
                })
            }
        
        else if (!this.state.angelListValue.includes('angel.co')&&
        !this.state.angelListValue!==null) {
                this.setState({
                    angelListError: true
                })
            }
         
       
        else if (this.state.costValue < 0) {
            this.setState({
                costError: true
            })
        }
        else if (this.state.bioValue.length > 200) {
            this.setState({
                bioValueError: true
            })
        }
        else {
            this.setState({
                saveClicked: true
            })
            this.props.updateUserProfile(
                this.state.bioValue,
                this.state.costValue,
                this.state.linkedInValue,
                this.state.angelListValue,
                this.state.gitHubValue
            )
        }
    }

    render() {
        const angelerrorDiv = (this.state.angelListError) ? (
            <span className="errorSpan">invalid angel list URL</span>
        ) : (null)
        const githuerrorDiv = (this.state.gitHibError) ? (
            <span className="errorSpan">invalid github URL</span>
        ) : (null)
        const linkedinerrorDiv = (this.state.linkInerror) ? (
            <span className="errorSpan">invalid linkedin URL</span>
        ) : (null)
        const costErrorDiv = (this.state.costError) ? (
            <span className="errorSpan">invalig cost</span>
        ) : (null)
        const bioErrorDiv = (this.state.bioValueError) ? (
            <span className="errorSpan">bio cant be more than 200 characters</span>
        ) : (null)

        return (this.state.saveClicked) ? (
            <div style={{ marginTop: "40px" }}>
                <h5>Updating.</h5>
            </div>
        ) : (
                <div className="profileFormContainer">
                    <span><b>Bio</b></span>
                    <span className="support">   (200 characters)</span>
                    <textarea
                        value={this.state.bioValue}
                        rows="6" onChange={this.changeBio} className="inputboxes" />
                    {bioErrorDiv}
                    <label><b>LinkedIn :</b></label>
                    <input
                        value={this.state.linkedInValue}
                        type="text" onChange={this.changeLinkedIn} className="inputboxes" />
                    {linkedinerrorDiv}
                    <label><b>GitHub : </b></label>
                    <input
                        value={this.state.gitHubValue}
                        type="text" onChange={this.changeGithub} className="inputboxes" />
                    {githuerrorDiv}
                    <label><b>Angel List : </b></label>
                    <input
                        value={this.state.angelListValue}
                        type="text" onChange={this.changeAngelList} className="inputboxes" />
                    {angelerrorDiv}
                    <label><b>How much would you link to charge for explaining for a minut</b></label>
                    <input value={this.state.costValue} type="number" onChange={this.updateCost} className="inputNumber"></input><span>$</span><br />
                    {costErrorDiv}
                    <button className="buttonLight" onClick={this.props.closeEditProfile}>Cancel</button>
                    <button className="buttonLight" onClick={this.uploadData}>Submit</button>
                </div>
            )
    }
}

ProfileForm.PropType = {
    updateUserProfile: PropType.func.isRequired,
    closeEditProfile:PropType.func.isRequired
};
const mapStateToProps = state => ({
    userName: state.profile.userName,
    cost: state.profile.cost,
    angelLink: state.profile.angelLink,
    githubLink: state.profile.githubLink,
    bio: state.profile.bio,
    linkinLink: state.profile.linkinLink
})

export default connect(mapStateToProps, {
    updateUserProfile,closeEditProfile
})(ProfileForm)

