import React, { Component } from 'react'
import './css/newlanding.css'
import './css/issueDetails.css'
import { connect } from 'react-redux';
import { Player } from 'video-react';
import PropType from 'prop-types';
import {getImagesByemail} from '../actions/projectActions'
import "../../node_modules/video-react/dist/video-react.css";
import config from '../config/config';
import CopyToClipboard from './tool/CopytoClipboard'



class issueDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questionIssue: {},
            image:"image",
            video:"video",
            element:null,
            src:null,
            displayCopyEle:false
        }
        this.changeDisplay = this.changeDisplay.bind(this)
        this.getImages = this.getImages.bind(this);
        this.showCopyEle = this.showCopyEle.bind(this)
    }

    showCopyEle(){
        this.setState({
            displayCopyEle : !this.state.displayCopyEle
        })
    }
    

    changeDisplay(e){
        this.setState({ state: this.state });
      var clickedProj = this.props.answerProject.find(proj=>proj.projectid == e.target.id)
        this.textExplain.textContent = clickedProj.textexplain;
        this.userName.textContent = clickedProj.username;
        if(clickedProj.videofilepath){
            if(!this.videoExplain){
                this.setState({
                    element:this.state.video,
                    src:clickedProj.videofilepath
                })
            }
            else{
                    this.videoExplain.src =clickedProj.videofilepath;
            }
        }
        else{
            if(!this.imageExplain)
            {
                this.setState({
                    element:this.state.image,
                    src:clickedProj.imgurl
                })
            }
            else{
                this.imageExplain.src = clickedProj.imgurl;
            }
        }
    }
    componentWillUnmount(){
        this.textExplain.textContent = " ";
        if(this.videoExplain){
            this.videoExplain.src =" ";
        }
        else{
            this.imageExplain.src = " ";
        }
        this.imgDiv.innerHtml = null
    }

    componentDidMount(){
        console.log("this.props.questionProject : ",this.props.questionProject)
        if(this.props.questionProject.videofilepath === null){
            console.log("this.props.questionProject.imgurl: ",this.props.questionProject.imgurl)
            this.setState({
                element:this.state.image,
                src : this.props.questionProject.imgurl
            })
        }
        else{
            console.log("this.props.quesproj.viodeofie : ",this.props.questionProject.videofilepath)
            this.setState({
                element:this.state.video,
                src : this.props.questionProject.videofilepath
            })
        }
    }

    getImages(projects){
      console.log("projectsssssssssss : ",projects)
      var emailOfanswers=[]
      for(var proj in projects){
            emailOfanswers.push(projects[proj].email)
      }
      console.log("emailOfanswers",emailOfanswers)
    //   this.props.getImagesByemail(emailOfanswers,projects)
        // projects.ForEach((projects)=>{
        //    
        // })

        

    }

    


    render() {
        var copyElement = null
        // if(this.state.displayCopyEle){
        //     copyElement = ( <div className="copyDisplay">
        //     <CopyToClipboard sharablelink = {config.react_url + '/project/' + this.props.questionProject.issueid} />
        //     </div>)
        // }
     


        var displayElement = ""
      console.log("videoSrc : ",this.state.src)
      console.log("element : ",this.state.element)
        const bottomImages = this.props.answerProject.map((proj,key )=>(
            <div key={key}className="imagePeopleModal ">
                <img id={proj.projectid} onClick={this.changeDisplay} src={proj.profilepic} className="peopleImage"></img>
            </div>
        ))
        if(this.state.element === this.state.video){
            console.log("this.state.element : ",this.state.element)
            console.log("this.state.video : ",this.state.video)
            displayElement  = (<div  ref={a=>this.imgDiv = a} className="audioModal">
            {/* <video  controls  src={this.props.questionProject.videofilepath}  >
   
</video> */}
            <video src={this.props.questionProject.videofilepath} controls  className="videoPlayer" ref={vid => this.videoExplain = vid}autoPlay="true" ></video>
            {/* <Player
    className="videoPlayer"
      ref={vid => this.videoExplain = vid}
      src={this.props.questionProject.videofilepath}
    /> */}
        
        </div>)
        }
        else{
            displayElement  = ( <div ref={a=>this.imgDiv = a} className="imageModal">
            <img  ref={img => this.imageExplain = img}src={this.props.questionProject.imgurl} width="100%" height="100%"></img>
        </div>)
        }
        return (
            <div className="issueCard issueModal">
                <div >
                    <div className="topButtons ">
                        <div>
                        {/* <button className="buttonLight tweetButton" onClick={this.showCopyEle}>Get Sharable Link</button> */}
                        </div>
                        <div className="profileNameDiv">
                            <p ref={p=>this.userName=p}></p>
                        </div>
                        <div >
                        </div>
                    </div>
                   {copyElement}
                    <div className="orginCard">
                        <div className="questionText questionModal">
                            <p  ref={p => this.textExplain = p}  >{this.props.questionProject.textexplain}</p>
                        </div>
                        {displayElement}
                    </div>
                </div>
                <div className="explainModal ">
                    {bottomImages}
                </div>
            </div>
        )
    }
}
issueDetails.PropType = {
    questionProject: PropType.object,
    answerProject: PropType.array,
    getImagesByemail:PropType.func
}
const mapStateToProps = state => ({
    questionProject: state.projects.questProject,
    answerProject: state.projects.answerProject
})
export default connect(mapStateToProps,{getImagesByemail})(issueDetails)