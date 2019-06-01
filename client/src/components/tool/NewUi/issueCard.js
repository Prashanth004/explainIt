import React, { Component } from 'react'
import DisplayIssueTopBtns from './DisplayIssueTpBtns'
import ImagesOfExplainers from './DisplayExplained';
import CopyToClipboard from '../CopytoClipboard'
import config from '../../../config/config';
import { confirmAlert } from 'react-confirm-alert'; // Import

import '../../css/toggle.css';
import {resetExplainAction} from '../../../actions/explainAction'
import { saveReplyEmailOption } from '../../../actions/emailAction'
import axios from 'axios';
import { explainIssue } from '../../../actions/messageAction'
import EditReason from './EditReason'
import ReactModal from 'react-modal';
import ExplainPage from './Explain/ExplainPage';
import { setIssueId } from '../../../actions/issueActions';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import ExplainedStories from './explainedStories';
import TwitterLogin from './TwitterLogin'
import { FiX } from "react-icons/fi";
import { openEditModal, closeEditModal } from '../../../actions/projectActions'
import { cancelAllMessageAction } from '../../../actions/messageAction';
import { restAllToolValue } from "../../../actions/toolActions";
import { resetValues } from '../../../actions/twitterApiAction'
import {resetLandingAction } from '../../../actions/landingAction'
class issueCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            answerProjects: [],
            DetailsOfPeople: [],
            showModalExplain: false,
            showModalTwitterLogin: false,
            showAllPeople: false,
            questionProject: [],
            publicStatus: "public",
            thisProjectId: null,
            textexplain: "",
            accessToDbDone: false
        }
        this.changeVideo = this.changeVideo.bind(this);
        this.openEditReason = this.openEditReason.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.toggleAllPeopleList = this.toggleAllPeopleList.bind(this);
        this.changepublicStatus = this.changepublicStatus.bind(this);
        this.reStoreDefault = this.reStoreDefault.bind(this);
    }
    openEditReason() {
        this.setState({
            showModalEditReason: true
        })
    }

    changepublicStatus(status) {
        this.setState({
            publicStatus: status
        })
    }
    componentDidMount() {
        this.setState({
            thisProjectId: this.props.issue.projectid,
            textexplain: this.props.issue.textexplain
        })
        var test = this.videoExplain
        test.addEventListener("mouseenter", function (event) {
            test.setAttribute("controls", "");
        })
        test.addEventListener("mouseleave", function () {
            test.removeAttribute("controls");
        })
    }
    handleOpenModal(e) {
        if (this.props.isAauthenticated) {
            this.props.explainIssue()
            this.props.setIssueId(e.target.id)
            localStorage.setItem("issueId", e.target.id)
            
            this.setState({ showModalExplain: true });
            this.props.saveReplyEmailOption(e.target.id, this.props.userid)
        }
        else {
            this.setState({ showModalTwitterLogin: true });
        }
    }
    toggleAllPeopleList() {
        this.setState({
            showAllPeople: !this.state.showAllPeople
        })
    }
    reStoreDefault = () => {
        if(this.props.isFullScreenRecording){
            confirmAlert({
                title: "Are you sure?",
                message: "You won't be able to revert this!",
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => this.handleCloseModal()
                    },
                    {
                        label: 'No',
                        onClick: () => this.handleCancel()
                    }
                ]
            })
        }
        else{
            this.handleCloseModal()
        }
       
    }
    handleCancel(){

    }
    handleCloseModal() {
        this.setState({ showModalExplain: false });
        this.setState({ showModalTwitterLogin: false });
        this.props.cancelAllMessageAction();
        this.props.resetValues();
        this.props.resetLandingAction();
        this.props.resetExplainAction();
        this.props.restAllToolValue();
        var source = this.props.extSource
        var origin = this.props.extOrigin
        const END_RECORD_TIME_END = {
            type:config.END_RECORD_TIMEOUT
        }
        if (this.props.extSource !== null) {
            console.log("posting from webpage")
            source.postMessage(END_RECORD_TIME_END, origin);
        }
        else{
            window.postMessage(END_RECORD_TIME_END, origin);
        }
   }
    changeVideo(e) {
        var clickedProj = this.state.answerProjects.find(proj => proj.projectid === e.target.id)
        if (clickedProj.videofilepath) {
            if (this.videoExplain) {
                this.videoExplain.src = clickedProj.videofilepath;
            }
        }
    }
    componentWillMount() {
        var self = this;

        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method: 'get',
            url: config.base_dir + '/api/project/issues/' + self.props.issue.issueid,
            headers: {
                "Authorization": token,
            }
        }).then((response) => {
            if (response.status === 200 || response.status === 304) {
                var allProjects = response.data.data
                var promises = []

                if (allProjects.length !== 0) {
                    allProjects.forEach((projects,index)=>{
                        promises.push(axios.get(config.base_dir + '/api/users/email/'+ allProjects[index].email))
                    })

                    axios.all(promises).then(results=>{
                        results.forEach((response, index)=>{
                            if(response.status === 200){
                            
                                allProjects[index]["profilepic"]=response.data.data.profilepic;
                                allProjects[index]["username"]=response.data.data.username;
                                allProjects[index]["twitterhandle"]=response.data.data.twitterhandle
                                allProjects[index]['id'] = response.data.data.id
                            }
                        })
                        var answerProject = allProjects.filter(project => project.isquestion !== "true")
                        var questionProject = allProjects.filter(projects => projects.isquestion === 'true')
                        self.setState({
                            answerProjects: answerProject,
                            DetailsOfPeople: answerProject,
                            questionProject: questionProject,
                            accessToDbDone: true
                        })

                    }).catch(err => {
                        console.log("error : ", err)
                    })
                }

            }
        })
            .catch(err => {
                console.log("error while fetching projects : ", err)
            })

    }
    render() {
        const displayTopButtons = (this.state.accessToDbDone)
            ? (<DisplayIssueTopBtns
                openEditReason={this.openEditReason}
                changepublicStatus={this.changepublicStatus}
                issue={this.props.issue}
                questionProject={this.state.questionProject[0]}
                toggleDisplayLink={this.props.toggleDisplayLink}
                handlePublicPrives={this.props.handlePublicPrives}
                tweetWindow={this.props.tweetWindow}
                deleteProjects={this.props.deleteProjects}
                itsHome={this.props.itsHome} />) : (null)
    
        const twitterBird = (this.state.publicStatus !== "private") ? (
            <span id={this.props.issue.issueid} className="hint--top" aria-label="Tweet it">

                <img alt="tweet" id={this.props.issue.issueid} width="100%" height="100%" onClick={this.props.tweetWindow} src={require('../../images/twitter.png')} />
            </span >
        ) : (null)
        const bottomImages = (<ImagesOfExplainers
            toggleAllPeopleList={this.toggleAllPeopleList}
            answerProjects={this.state.answerProjects}
            issueid={this.props.issue.issueid}
            showAllPeople={this.state.showAllPeople}
            DetailsOfPeople={this.state.DetailsOfPeople} />)
        const tweetOption = (this.props.isAauthenticated) ? (

            <div style={{ display: this.state.displayTwitter }} id={this.props.issue.issueid} className="twitter">
                {twitterBird}
            </div>

        ) : (null)

        var date = this.props.issue.date.slice(5, 7)
        return (<div className="cardWithDate">
            <div className="dateOfCard">
                <div className="date">
                    <span>{this.props.issue.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{this.props.issue.date.slice(0, 4)}</span>
                </div>
            </div>
            <div key={this.props.issue.issueid} className="issueCard">
                <div className="orginCard">
                    {displayTopButtons}
                    <div className="copyDisplay" id={"clipboard_" + this.props.issue.issueid} style={{ display: "none" }}>
                        <CopyToClipboard sharablelink={config.react_url + '/project/' + this.props.issue.issueid} />
                    </div>
                    <div id={this.props.issue.issueid} onClick={this.props.togglemodal}
                        className="questionText">
                        <span id={"text_" + this.props.issue.projectid} >{this.props.issue.textexplain}</span>
                    </div>
                    <div id={this.props.issue.issueid} onClick={this.props.togglemodal} className="questionImg">
                        <video id={this.props.issue.issueid}
                            autoPlay={true}
                            muted
                            className="explainVideo"
                            ref={vid => this.videoExplain = vid}
                            width="100%" height="100%" src={this.props.issue.videofilepath} ></video>
                    </div>

                </div>
                <div id={this.props.issue.issueid} className="explainAnswer">

                    {bottomImages}


                    <div className="twitterContainer">
                        {tweetOption}
                    </div>

                    <div className="explainIt">
                        <button id={this.props.issue.issueid} className="buttonLight explainItBtn" style={{color:"white"}} onClick={this.handleOpenModal}>Explain it</button>
                    </div>
                    <ReactModal
                        isOpen={this.props.isopenEditModal}
                        contentLabel="Minimal Modal Example"
                        className="ModalEdit"
                        overlayClassName="OverlayEdit"
                    >
                        <div>

                            <div onClick={this.props.closeEditModal} className="closeModalBtn">
                                <span>
                                    <FiX className="closeIcon" onClick={this.props.closeEditModal} />
                                </span>
                            </div>
                            <EditReason
                                initailText={this.state.textexplain}
                                projectId={this.state.thisProjectId} />
                        </div>

                    </ReactModal>
                    <ReactModal
                        isOpen={this.state.showModalTwitterLogin}
                        contentLabel="Minimal Modal Example"
                        className="ModalA"
                        overlayClassName="OverlayA">
                        <div>

                            <div onclick={this.reStoreDefault} className="closeModalBtn">
                                <span>
                                    <FiX className="closeIcon" onClick={this.reStoreDefault} />
                                </span>
                            </div>
                            <TwitterLogin
                                handleCloseModal={this.reStoreDefault} />
                        </div>

                    </ReactModal>

                    <ReactModal
                        isOpen={this.state.showModalExplain}
                        className="ModalA"
                        overlayClassName="OverlayA">
                        <div >
                            <div onClick={this.reStoreDefault} className="closeModalBtn">
                                <span>
                                    <FiX className="closeIcon" onClick={this.reStoreDefault} />
                                </span>
                            </div>
                            <ExplainPage
                                handleCloseModal={this.reStoreDefault}
                                questionProject = {this.state.questionProject[0]} />
                        </div>
                        {/* <button onClick={this.handleCloseModal}>Close Modal</button> */}
                    </ReactModal>
                    <ReactModal
                        isOpen={this.state.showAllPeople}
                        className="ModalA stories"
                        overlayClassName="OverlayA">
                        <div >
                            <div onclick={this.toggleAllPeopleList} className="closeModalBtn">
                                <span>
                                    <FiX className="closeIcon" onClick={this.toggleAllPeopleList} />
                                </span>
                            </div>
                            <ExplainedStories
                                DetailsOfPeople={this.state.DetailsOfPeople}
                            />
                        </div>
                    </ReactModal>

                </div>


            </div>
        </div>)
    }
}
issueCard.PropType = {
    setIssueId: PropType.func.isRequired,
    cancelAllMessageAction: PropType.func.isRequired,
    restAllToolValue: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    saveReplyEmailOption: PropType.func.isRequired,
    

};
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    isopenEditModal: state.projects.openEditModal,
    userid: state.auth.id,
    extSource:state.extension.source,
    extOrigin:state.extension.origin,
    isFullScreenRecording: state.tools.isFullScreenRecording,


})

export default connect(mapStateToProps, {
    setIssueId,
    resetLandingAction,
    cancelAllMessageAction,
    restAllToolValue,
    explainIssue,
    resetExplainAction,
    saveReplyEmailOption,
    openEditModal,
    closeEditModal,
    resetValues
})(issueCard)




