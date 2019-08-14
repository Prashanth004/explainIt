import React, { Component } from 'react'
import config from '../../../../config/config';
import '../../../css/toggle.css';
import './compact.css'
import { resetExplainAction } from '../../../../actions/explainAction'
import { saveReplyEmailOption } from '../../../../actions/emailAction'
import axios from 'axios';
import { explainIssue } from '../../../../actions/messageAction'
import { setIssueId } from '../../../../actions/issueActions';
import { connect } from 'react-redux';
import { openEditModal, closeEditModal } from '../../../../actions/projectActions'
import { cancelAllMessageAction } from '../../../../actions/messageAction';
import { restAllToolValue } from "../../../../actions/toolActions";
import { resetValues } from '../../../../actions/twitterApiAction'
import { resetLandingAction } from '../../../../actions/landingAction';
import { getAllContacts } from '../../../../actions/contactAction'
class issueCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            answerProjects: [],
            DetailsOfPeople: [],
            questionProject: [],
            noOfExplain:0,
            thisProjectId: null,
            textexplain: "",
            accessToDbDone: false,
            socket: null
        }
        this.openProject =this.openProject.bind(this);
    }
    openProject(){
        window.open(config.react_url+'/project/'+this.props.issue.issueid)
    }

    componentWillMount() {
        var self = this;
        var answerProject = [];
        var questionProject = [];
        this.props.getAllContacts();
        this.setState({ socket: this.props.socket })
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
                    allProjects.forEach((projects, index) => {
                        promises.push(axios.get(config.base_dir + '/api/users/id/' + allProjects[index].userid))
                    })

                    axios.all(promises).then(results => {
                        results.forEach((response, index) => {
                            if (response.status === 200) {
                                allProjects[index]["profilepic"] = response.data.data.profilepic;
                                allProjects[index]["username"] = response.data.data.username;
                                allProjects[index]["twitterhandle"] = response.data.data.twitterhandle;
                                allProjects[index]['id'] = response.data.data.id;
                                allProjects[index]['active'] = response.data.data.online
                            }
                        })
                        answerProject = allProjects.filter(project => project.isquestion !== "true")
                        questionProject = allProjects.filter(projects => projects.isquestion === 'true')
                        self.setState({
                            answerProjects: answerProject,
                            DetailsOfPeople: answerProject,
                            questionProject: questionProject,
                            accessToDbDone: true,
                            noOfExplain:answerProject.length
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
        var date = this.props.issue.time.slice(5, 7);
        return (<div className="compactCard" onClick={this.openProject}>
            <span className="spanExplained" >{this.props.issue.time.slice(8, 10)}  {config.monthPicker[date]}, {this.props.issue.time.slice(0, 4)}</span>
                <p id={"text_" + this.props.issue.projectid} ><b>Topic : {this.props.issue.textexplain}</b></p>
            <div style={{display:"grid",gridTemplateColumns:"50% 50%", textAlign:"center"}}>
            <div></div>
            <div><span className="spanExplained">{this.state.noOfExplain} Explained</span></div>
            </div>
        </div>)
    }
}

const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    isopenEditModal: state.projects.openEditModal,
    userid: state.auth.id,
    extSource: state.extension.source,
    extOrigin: state.extension.origin,
    isFullScreenRecording: state.tools.isFullScreenRecording,
    socket: state.home.socket,
    explainBy: state.explain.explainBy,
    newAnswerProject: state.profile.newAnswerProject,
    topicOfTheCall: state.call.topicOfTheCall

})

export default connect(mapStateToProps, {
    setIssueId, getAllContacts,
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




