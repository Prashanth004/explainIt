import React, { Component } from 'react'
import '../../css/newlanding.css'
import Navbar from './Navbar'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IssueDetils from '../../issueModal'
import { connect } from 'react-redux';
import Explain from './Explainit'
import Froms from '../Form';
import { fetchIssues, setIssueId } from '../../../actions/issueActions';
import { fetchProjectbyIssue ,clearAnswers } from '../../../actions/projectActions';
import { stillAuthenicated } from '../../../actions/signinAction';
import { getProfileDetails } from '../../../actions/profileAction'
import PropType from 'prop-types';
import LoginMadal from '../../LoginModal'
// import ImagesOfExplainers from './DisplayExplained'
import Swal from 'sweetalert2'
import config from '../../../config/config'
import ProfileCard from './ProfileCard'
import IssueDisplay from './DisplayIssues'
import Content from './Content'
import { saveExtensionDetails, saveSourceId } from "../../../actions/extensionAction";



class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalTool: false,
            openExplain : false,
            showProjects:false
        }
        this.togglemodal = this.togglemodal.bind(this)
        this.explainTool = this.explainTool.bind(this)
        this.toggleModalCreate = this.toggleModalCreate.bind(this)
        this.toodleExplain = this.toodleExplain.bind(this);
        this.toggleProjects = this.toggleProjects.bind(this);
    }
    reloadPage(){
        window.location.reload();
    }
    componentWillMount() {
        this.props.stillAuthenicated()
      }

    componentDidMount(){
        var self = this
        function postMessageHandler(event) {
            if (event.data.sourceId !== undefined) {
                console.log("We've got a message!");
                console.log("* Message:", event.data);
                console.log("* Origin:", event.origin);
                console.log("* Source:", event.source);
                console.log("*event.data.message__sourceId : ", event.data.sourceId)
                self.props.saveSourceId(event.data.sourceId)
            }

            if (event.data === 'rtcmulticonnection-extension-loaded') {
              console.log(" event.source :", event.source)
                self.setState({
                    source: event.source,
                    origin: event.origin,
                    gotmessage: true
                })
                self.props.saveExtensionDetails(event.source,event.origin)
            }
        }
        if (window.addEventListener) {
            window.addEventListener("message", postMessageHandler, false);
        } else {
            window.attachEvent("onmessage", postMessageHandler);
        }
    }
    componentWillMount() {

        this.props.fetchIssues()
    }
    toodleExplain(){
        localStorage.setItem("issueId",null)
        this.setState({
            openExplain : !this.state.openExplain
        })
    }
    toggleProjects(){
        this.setState({
            showProjects : !this.state.showProjects
        })
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

        if (classOfClicked!=="singleMember" && classOfClicked!=="explainAnswer" && classOfClicked!=="displayPeople" && classOfClicked!=="likes" && classOfClicked!== "numberOfPeople" &&idOfClicked !=="explainIt" && idOfClicked !=="audio" && idOfClicked !=="tweet" && idOfClicked !=="shareScreen" && idOfClicked !=="imageOfPeople" && classOfClicked !=="buttonDark explainItBtn") {
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
        var deatilsModal = null
        deatilsModal = (<IssueDetils />)
        var issueList = this.props.myissues;
        
        var self = this
        window.addEventListener('storage', function(event){
            if (event.key == 'token') { 
                self.reloadPage()
            }
        })
        var explainDiv =null;
        var feedDiv = null;
        if(this.props.isAauthenticated){
        if(this.state.openExplain){
            explainDiv = (<Explain />)
        }
        if(this.state.showProjects){
            // var issueListRev = issueList.reverse()
            feedDiv = ( <div >
                <IssueDisplay togglemodal={this.togglemodal} explainTool = {this.explainTool} issueArray={issueList}/>
                {/* {issueItems} */}
                </div>)
        }
    }
        if(this.props.isAauthenticated){
           
            // this.props.getProfileDetails(this.props.userId)
            var profileCardElement = ( 
            <div><ProfileCard userId={this.props.userId} toggleProjects={this.toggleProjects} />
                <button className="buttonDark explainBtn" onClick={this.toodleExplain}>Explain</button>
                </div>
            )
        }
        else{
            var profileCardElement = (<Content />)
        }
   
     
        var self = this
       
        return (
            <div className="fullHome">
                <Navbar />
                <div className="containerHome">
                <div>
                        {profileCardElement}
                </div>
                                   
                    <div >
                 {explainDiv}
                
                    </div>
                    <div>
                    {feedDiv}
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
    getProfileDetails:PropType.func.isRequired,
    saveExtensionDetails :PropType.func.isRequired,
    saveSourceId : PropType.func.isRequired
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated,
    profilePic:state.auth.profilePic,
    userName:state.auth.userName,
    myissues : state.profile.myIssues,
    email:state.auth.email,
    userId :state.auth.id
    
})

export default connect(mapStateToProps, {saveExtensionDetails, saveSourceId,fetchProjectbyIssue,setIssueId, fetchIssues, getProfileDetails, clearAnswers, stillAuthenicated, fetchProjectbyIssue, setIssueId })(NewHome)
