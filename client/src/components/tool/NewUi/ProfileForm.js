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
            bioValue: "",
            linkedInValue: "",
            gitHubValue: "",
            worksValue:"",
            goodAtValue:"",
            worksValueError:"",
            goodAtValueError:null,
            angelListValue: "",
            costValue: null,
            costError: false,
            bioValueError: false,
            linkInerror: false,
            gitHibError: false,
            angelListError: false,
            saveClicked: false,
            
        }
        this.changeBio = this.changeBio.bind(this);
        this.changeLinkedIn = this.changeLinkedIn.bind(this);
        this.changeGithub = this.changeGithub.bind(this);
        this.changeAngelList = this.changeAngelList.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.updateCost = this.updateCost.bind(this);
        this.changeGoodAt = this.changeGoodAt.bind(this);
        this.changeWorks = this.changeWorks.bind(this);
    }
    componentDidMount() {
        this.setState({
            bioValue: this.props.bio,
            linkedInValue: this.props.linkinLink,
            gitHubValue: this.props.githubLink,
            angelListValue: this.props.angelLink,
            costValue: this.props.cost,
            goodAtValue:this.props.goodat,
            worksValue:this.props.works
        })
    }
    changeWorks(e){
        this.setState({
            worksValue: e.target.value,
            worksValueError: null
        })
    }
    changeGoodAt(e){
        this.setState({
            goodAtValue: e.target.value,
            goodAtValueError: null
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
       
        if(this.state.linkedInValue.length!==0){
            if (!this.state.linkedInValue.includes('www.linkedin.com')) {
                this.setState({
                    linkInerror: true
                })
            }
        }
            if(this.state.gitHubValue.length!==0){
        if (!this.state.gitHubValue.includes('github.com')) {
                this.setState({
                    gitHibError: true
                })
            }
        }
        if(this.state.angelListValue.length!==0){
        if (!this.state.angelListValue.includes('angel.co')) {
                this.setState({
                    angelListError: true
                })
            }
        }
         
       
        if (this.state.costValue < 0) {
            this.setState({
                costError: true
            })
        }
       if(this.state.goodAtValue!==null)
        if (this.state.goodAtValue.length > 200) {
            this.setState({
                goodAtValueError: true
            })
        }
        if(this.state.bioValue!==null)
        if (this.state.bioValue.length > 200) {
            this.setState({
                bioValueError: true
            })
        }
        setTimeout(()=>{
            if(!this.state.bioValueError&&
                !this.state.costError&&
                !this.state.angelListError&&
                !this.state.gitHibError&&
                !this.state.linkInerror &&
                !this.state.goodAtValueError
            ) {
                    
                this.setState({
                    saveClicked: true
                })
                this.props.updateUserProfile(
                    this.state.bioValue,
                    this.state.costValue,
                    this.state.linkedInValue,
                    this.state.angelListValue,
                    this.state.gitHubValue,
                    this.state.goodAtValue,
                    this.state.worksValue
                )
            }
        },500)
       
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
        // const costErrorDiv = (this.state.costError) ? (
        //     <span className="errorSpan">invalig cost</span>
        // ) : (null)
        const bioErrorDiv = (this.state.bioValueError) ? (
            <span className="errorSpan">bio cant be more than 200 characters</span>
        ) : (null)
        const goodAtErrorDiv = (this.state.goodAtValueError) ? (
            <span className="errorSpan">Can not be more than 200 characters</span>
        ) : (null)

        return (this.state.saveClicked) ? (
            <div style={{ marginTop: "40px" }}>
                <h5>Updating.</h5>
            </div>
        ) : (
                <div className="profileFormContainer">
                    <span><b>Who am I</b></span>
                    <span className="support">   (200 characters)</span>
                    <br/>
                    <span className="support">(optional)</span>
                    <textarea
                        value={this.state.bioValue}
                        rows="6" onChange={this.changeBio} className="inputboxes" />
                    {bioErrorDiv}

                       <span><b>What am I good at</b></span>
                    <span className="support">   (150 characters)</span>
                    <br/>
                    <span className="support">(optional)</span>
                    <textarea
                        value={this.state.goodAtValue}
                        rows="3" onChange={this.changeGoodAt} className="inputboxes" />
                    {goodAtErrorDiv}

                    <span><b>My works</b></span>
                    <br/>
                    <span  className="support">(optional)</span>
                    <textarea
                        value={this.state.worksValue}
                        rows="3" onChange={this.changeWorks} className="inputboxes" />
                   
                    <span><b>LinkedIn :</b></span>
                    <br/>
                   
                    <span  className="support">(optional)</span>
                    <input
                    type="text" 
                        value={this.state.linkedInValue}
                        onChange={this.changeLinkedIn} className="inputboxes" />
                    {linkedinerrorDiv}
                    <span><b>GitHub :</b></span>
                    <br/>
                    
                    <span  className="support">(optional)</span>
                    <input
                        value={this.state.gitHubValue}
                        type="text" onChange={this.changeGithub} className="inputboxes" />
                    {githuerrorDiv}
                    <span><b>LinkedIn :</b></span>
                    <br/>
                   
                    <span  className="support">(optional)</span>
                    <input
                        value={this.state.angelListValue}
                        type="text" onChange={this.changeAngelList} className="inputboxes" />
                    {angelerrorDiv}
                    {/* <label><b>How much would you link to charge for explaining for a minut</b></label>
                    <input value={this.state.costValue} type="number" onChange={this.updateCost} className="inputNumber"></input><span>$</span><br />
                    {costErrorDiv} */}
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
    linkinLink: state.profile.linkinLink,
    goodat:state.profile.goodat,
    works:state.profile.works
})

export default connect(mapStateToProps, {
    updateUserProfile,closeEditProfile
})(ProfileForm)

