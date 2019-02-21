import React, { Component } from 'react'
import './css/newlanding.css'
import Navbar from '../components/Navbar'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import IssueDetils from './issueModal'
import { connect } from 'react-redux';
import Froms from './tool/Form';
import { fetchIssues, setIssueId } from '../actions/issueActions';
import { fetchProjectbyIssue, clearAnswers } from '../actions/projectActions';
import { stillAuthenicated } from '../actions/signinAction'
import PropType from 'prop-types';
import LoginMadal from './LoginModal'
import ImagesOfExplainers from './DisplayExplained'
import Swal from 'sweetalert2'
import config from '../config/config'


class NewHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalTool: false
        }
        this.togglemodal = this.togglemodal.bind(this)
        this.togglemodalTool = this.togglemodalTool.bind(this)
    }


    componentWillMount() {

        this.props.fetchIssues()
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.newissueIem) {
    //         this.props.issues.unshift(nextProps.newissueIem);
    //     }
    //     else {
    //         console.log("i am not working!!!!!!!!!!!!!!!!!!")
    //     }
    // }

    toggleModalCreate = () => {
        if (this.props.isAauthenticated) {
            this.props.setIssueId(null)
            localStorage.setItem("issueId", null)
            window.open(config.react_url+'/explainIt', "_blank")
            // this.props.history.push('/explainIt')
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
    togglemodalTool = (e) => {
        // togglemodalTool
        if (this.props.isAauthenticated) {
            this.props.setIssueId(e.target.id)
            localStorage.setItem("issueId", e.target.id)
            // this.props.history.push('/explainIt')
            window.open(config.react_url+'/explainIt', "_blank")
        }
        else {
            // this.setState({
            //     modalTool: !this.state.modalTool
            // });
            Swal.fire(
                'You should login'
              )
        }
    }

    render() {
        var deatilsModal = null
        deatilsModal = (<IssueDetils />)
        console.log("length of the issues array",(this.props.issues).length);
        console.log("Issues list :",this.props.issues )
        var issueList = this.props.issues;
        console.log(issueList.length);
        console.log("issueList : ",issueList)
        const issueItems = issueList.map((issue,index) => (
            <div key={index} onClick={this.togglemodal} key={issue.issueid} className="issueCard">
                <div className="orginCard">
                    <div id={issue.issueid} className="topButtons">
                        <div id={issue.issueid}>
                            <button id="shareScreen" className="buttonLight sharBtn" ><i className="glyphicon glyphicon-duplicate"></i>
                            </button>
                        </div>
                        <div>
                            </div>
                        <div id={issue.issueid} className="twitterHolder">
                            {/* <button id="tweet" className="buttonLight tweetButton">Tweet</button> */}
                            <div id={issue.issueid} className="twitter">
                            {/* <ImageDisplay /> */}
                                <img width="100%" height="100%" src={require('./images/twitter3.png')}/>
                            </div>
                        </div>
                    </div >
                    <div id={issue.issueid} className="questionText">
                        <p id={issue.issueid} >{issue.textexplain}</p>

                    </div>
                    <div id={issue.issueid} className="questionImg">
                        <img id={issue.issueid} width="100%" height="100%"src={issue.imgurl} ></img>
                    </div>

                    {/* <div  id = {issue.issueid} className="cardAudio">
                    <audio id="audio" controls={true} src={issue.audiofilepath} className="cardAudio"></audio>
                </div> */}
                </div>
                <div id={issue.issueid} className="explainAnswer">
                <ImagesOfExplainers issueid={issue.issueid} />
                   
                    <div  className="explainIt">
                        <button id={issue.issueid} className="buttonDark explainItBtn" onClick={this.togglemodalTool}>Explain it</button>
                    </div>
                </div>
            </div>
        ))
        return (
            <div>
                <Navbar />

                <div className="containerHome">
                    <div className="addBtn">
                        <button className="buttonLight" onClick={this.toggleModalCreate}>Add Project</button>
                    </div>
                    {issueItems}
                </div>


                <Modal isOpen={this.state.modal} toggle={this.togglemodal} className={this.props.className}>

                    <ModalBody className="modalBody">

                        {deatilsModal}
                    </ModalBody>

                </Modal>


                <Modal isOpen={this.state.modalTool} toggle={this.togglemodalTool} className={this.props.className}>

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
    setIssueId: PropType.func.isRequired
};
const mapStateToProps = state => ({
    issues: state.issues.items,
    newissueIem: state.issues.newissueIem,
    isAauthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { fetchIssues, clearAnswers, stillAuthenicated, fetchProjectbyIssue, setIssueId })(NewHome)
