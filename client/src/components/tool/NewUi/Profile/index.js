import React, { Component } from 'react'
import '../../../css/ProfileForm.css';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import Section1 from './section1';
import Section2 from './section2';
import {closeEditProfile, updateUserProfile } from '../../../../actions/profileAction';

class ProfileForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
            nextSetion:false
            
        }
        this.changeBio = this.changeBio.bind(this);
        this.changeLinkedIn = this.changeLinkedIn.bind(this);
        this.changeGithub = this.changeGithub.bind(this);
        this.changeAngelList = this.changeAngelList.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.updateCost = this.updateCost.bind(this);
        this.changeGoodAt = this.changeGoodAt.bind(this);
        this.changeWorks = this.changeWorks.bind(this);
        this.SecTrans = this.SecTrans.bind(this);
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
    SecTrans(){
        if (this.state.costValue < 0) {
            this.setState({
                costError: true
            })
        }
       else if(this.state.goodAtValue!==null)
        if (this.state.goodAtValue.length > 150) {
            this.setState({
                goodAtValueError: true
            })
        }
       else if(this.state.bioValue!==null)
        if (this.state.bioValue.length > 200) {
            this.setState({
                bioValueError: true
            })
        }
        else
            this.setState({nextSetion:!this.state.nextSetion})
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
     
        setTimeout(()=>{
            if(!this.state.angelListError &&
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
        return (this.state.saveClicked) ? (
            <div style={{ marginTop: "40px" }}>
                <h5>Updating.</h5>
            </div>
        ) :(!this.state.nextSetion)?(<Section1 
            SecTrans={this.SecTrans}
            bioValue={this.state.bioValue}
            changeBio = {this.changeBio}
            goodAtValue = {this.state.goodAtValue}
            changeGoodAt = {this.changeGoodAt}
            worksValue = {this.state.worksValue}
            changeWorks=  {this.changeWorks}
            bioValueError={this.state.bioValueError}
            closeEditProfile={this.props.closeEditProfile}
            goodAtValueError={this.state.goodAtValueError}/>)
            :(<Section2
                SecTrans={this.SecTrans}
                linkInerror={this.state.linkInerror}
                linkedInValue={this.state.linkedInValue}
                changeLinkedIn={this.changeLinkedIn}
                gitHubValue={this.state.gitHubValue}
                gitHibError={this.state.gitHibError}
                changeGithub={this.changeGithub}
                angelListError={this.state.angelListError}
                angelListValue={this.state.angelListValue}
                changeAngelList={this.changeAngelList}
                closeEditProfile={this.props.closeEditProfile}
                uploadData={this.uploadData}/>)
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

