import React, { Component } from 'react'
import './css/newlanding.css'
import './css/issueDetails.css'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {getImagesByemail} from '../actions/projectActions'


class issueDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questionIssue: {},
            image:"image",
            video:"video",
            element:null,
            src:null,

        }
        this.changeDisplay = this.changeDisplay.bind(this)
        this.getImages = this.getImages.bind(this)
    }
    

    changeDisplay(e){
        this.setState({ state: this.state });
      var clickedProj = this.props.answerProject.find(proj=>proj.projectid == e.target.id)
        this.textExplain.textContent = clickedProj.textexplain;
       
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
        if(this.props.questionProject.videofilepath !== null){
            this.setState({
                element:this.state.image,
                src : this.props.questionProject.imgurl
            })
        }
        else{
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
      this.props.getImagesByemail(emailOfanswers,projects)
        // projects.ForEach((projects)=>{
        //    
        // })

        

    }

    


    render() {
        var displayElement = ""
      
        const bottomImages = this.props.answerProject.map((proj,key )=>(
            <div className="imagePeopleModal ">
                <img id={proj.projectid} onClick={this.changeDisplay} src={proj.profilepic} className="peopleImage"></img>
            </div>
        ))
        if(this.state.element ===this.state.video){
            console.log("this.state.element : ",this.state.element)
            console.log("this.state.video : ",this.state.video)
            displayElement  = (<div  ref={a=>this.imgDiv = a}className="audioModal">
            <video  className="videoPlayer" ref={vid => this.videoExplain = vid}controls="true" src={this.state.src}></video>
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
                            <button className="buttonLight sharBtn" >Share Screen</button>
                        </div>
                        <div >
                            <button className="buttonLight tweetButton">Tweet</button>
                        </div>
                    </div>
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