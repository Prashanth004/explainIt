import React, { Component } from 'react'
import './css/newlanding.css'
import Navbar from '../components/Navbar'
import { Modal, ModalBody } from 'reactstrap';
import IssueDetils from './issueModal'
import { connect } from 'react-redux';
import { fetchIssues, setIssueId } from '../actions/issueActions';
import { fetchProjectbyIssue ,clearAnswers } from '../actions/projectActions';
import { stillAuthenicated } from '../actions/signinAction';
import { getProfileDetails } from '../actions/profileAction'
import PropType from 'prop-types';
import LoginMadal from './LoginModal'
import Swal from 'sweetalert2'
import config from '../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'


class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalTool: false
        }
        this.togglemodal = this.togglemodal.bind(this)
        this.explainTool = this.explainTool.bind(this)
    }

    componentWillMount() {
        this.props.fetchIssues()
        var userId=this.props.match.params.userid;
        this.props.getProfileDetails(userId)
    }
  
    toggleModalCreate = () => {
        if (this.props.isAauthenticated) {
            this.props.setIssueId(null)
            localStorage.setItem("issueId", null)
            window.open(config.react_url+'/explainIt', "_blank")
        }
        else {
            Swal.fire(
                'You should login'
              )
        }
    }
    togglemodal = (e) => {
        var idOfClicked = e.target.id;
        var classOfClicked = e.target.className
        console.log("e.target.id : ",e.target.id)

        if ( classOfClicked!=="displayPeople" && classOfClicked!=="likes" && classOfClicked!== "numberOfPeople" &&idOfClicked !=="explainIt" && idOfClicked !=="audio" && idOfClicked !=="tweet" && idOfClicked !=="shareScreen" && idOfClicked !=="imageOfPeople" && classOfClicked !=="buttonDark explainItBtn") {
            if (this.state.modal === false) {
                this.props.clearAnswers(e.target.id)
                this.props.fetchProjectbyIssue(e.target.id);
            }
            this.setState({
                modal: !this.state.modal
            });
        }
    }
    explainTool = (e) => {
        if (this.props.isAauthenticated) {
            this.props.setIssueId(e.target.id)
            localStorage.setItem("issueId", e.target.id)
            window.open(config.react_url+'/explainIt', "_blank")
        }
        else {
            Swal.fire(
                'You should login'
              )
        }
    }

    render() {

        
        var profileCardElement = ( <ProfileCard  />)
        var deatilsModal = null
        deatilsModal = (<IssueDetils />)
        var issueList = this.props.issues;
        var personalIssues = null
        var self = this
        var displayIssue = null;
        if(this.props.email!==null){
            personalIssues = issueList.filter((issue)=>
            issue.email=== self.props.email
        )
        displayIssue =( <IssueDisplay togglemodal={this.togglemodal} explainTool = {this.explainTool} issueArray={personalIssues}/>)
    }
       
      

        return (
            <div>
                <Navbar />
                <div className="containerHome">
                <div>
                        {profileCardElement}
                </div>
                                   
                    <div >
                  {displayIssue} 
                    </div>
                </div>


                 <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={this.props.className}>

                    <ModalBody className="modalBody">
                        {deatilsModal}
                    </ModalBody>

                </Modal>


                <Modal isOpen={this.state.modalTool} toggle={this.explainTool} className={this.props.className}>

                    <ModalBody className="modalBodyTool">
                        <LoginMadal />
                    </ModalBody>

                </Modal> 

            </div>
        )
    }
}
NewHome.PropType = {
    fetchIssues: PropType.func.isRequired,
    issues: PropType.array.isRequired,
    fetchProjectbyIssue: PropType.func.isRequired,
    setIssueId: PropType.func.isRequired,
    getProfileDetails:PropType.func.isRequired
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated,
    email:state.profile.email,
    profilePic:state.profile.profilePic,
    userId :state.auth.id
    
})

export default connect(mapStateToProps, {fetchProjectbyIssue,setIssueId, fetchIssues, getProfileDetails, clearAnswers, stillAuthenicated, fetchProjectbyIssue, setIssueId })(NewHome)
