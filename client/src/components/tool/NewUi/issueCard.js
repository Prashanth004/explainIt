import React, { Component } from 'react'
import DisplayIssueTopBtns from './DisplayIssueTpBtns'
import ImagesOfExplainers from './DisplayExplained';
import CopyToClipboard from '../CopytoClipboard'
import config from '../../../config/config';
import '../../css/toggle.css';
import axios from 'axios'

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={
            answerProjects:[],
            DetailsOfPeople:[]
        }
        this.changeVideo = this.changeVideo.bind(this)
    }
    changeVideo(e){
        console.log(e.target.id)
        console.log("this.state.answerProjects : ",this.state.answerProjects)
        var clickedProj = this.state.answerProjects.find(proj=>proj.projectid == e.target.id)
        if(clickedProj.videofilepath){
            if(this.videoExplain){
                this.videoExplain.src =clickedProj.videofilepath;
            }
        }

    }
    componentWillMount(){
        var self = this;
       
        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method:'get',
            url:config.base_dir+'/api/project/issues/'+self.props.issue.issueid,
            headers: {
                "Authorization": token,
            }
        }).then((response)=>{
            if(response.status === 200 || response.status === 304){
                var allProjects = response.data.data
                var answerProject = allProjects.filter(project => project.isquestion !="true")
                self.setState({
                    answerProjects:answerProject
                })
                if(answerProject.length!==0){
                   answerProject.forEach(function(projects, index){
                        axios({
                            method:'get',
                            url:config.base_dir+'/api/users/email/'+projects.email,
                        }).then(response=>{
                            console.log("final response: ", response)
                            if(response.status==200){
                            const newTestJson = JSON.parse(JSON.stringify(answerProject));
                            newTestJson[index]['profilepic']=response.data.data.profilepic;
                            newTestJson[index]['username']=response.data.data.username;
                            newTestJson[index]['id']=response.data.data.id
                            answerProject =newTestJson
                            console.log("newTestJson : ",newTestJson)
                            self.setState({
                                DetailsOfPeople:answerProject
                            })
                            }
                        })
                        .catch(err=>{
                            console.log("error : ",err)
                        })
                    })
                   }
                   
            }
        })
        .catch(err=>{
            console.log("error while fetchinf projects : ",err)
        })
        
    }
  render() {
    console.log("this.state.answerProjects :",this.state.DetailsOfPeople )

    if (this.props.displayCopyEle) {
        var copyElement = (<div className="copyDisplay">
            <CopyToClipboard sharablelink={config.react_url + '/project/' + this.props.projectId} />
        </div>)
    }
    else {
        var copyElement = null
    }
    return (
      <div>
         <div key={this.props.issue.issueid} className="issueCard">
                    <div className="orginCard">
                       <DisplayIssueTopBtns
                       issue={this.props.issue}
                       toggleDisplayLink={this.props.toggleDisplayLink} 
                       handlePublicPrives={this.props.handlePublicPrives}
                       tweetWindow = {this.props.tweetWindow}
                       deleteProjects= {this.props.deleteProjects}
                       itsHome = {this.props.itsHome}/>
                        {/* {copyElement} */}
                        <div className="copyDisplay" id={"clipboard_" + this.props.issue.issueid} style={{ display: "none" }}>
                            <CopyToClipboard sharablelink={config.react_url + '/project/' + this.props.projectId} />
                        </div>
                        <div id={this.props.issue.issueid} onClick={this.props.togglemodal}
                         className="questionText">
                            <p id={this.props.issue.issueid} >{this.props.issue.textexplain}</p>
                        </div>
                        <div id={this.props.issue.issueid} onClick={this.props.togglemodal} className="questionImg">
                            <video controls id={this.props.issue.issueid}
                            ref={vid => this.videoExplain = vid}
                              video width="100%" height="100%" src={this.props.issue.videofilepath} ></video>
                        </div>

                    </div>
                    <div id={this.props.issue.issueid} className="explainAnswer">
                        <ImagesOfExplainers 
                        changeVideo={this.changeVideo}
                        answerProjects={this.state.answerProjects}
                        issueid={this.props.issue.issueid}
                        DetailsOfPeople={this.state.DetailsOfPeople} />
                        <div className="explainIt">
                            <button id={this.props.issue.issueid} className="buttonDark explainItBtn" onClick={this.props.explainTool}>Explain it</button>
                        </div>
                    </div>
                </div>
      </div>
    )
  }
}
