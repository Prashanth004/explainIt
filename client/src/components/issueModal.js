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
        // this.userName.textContent = clickedProj.username;
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
        if(this.props.questionProject.videofilepath === null){
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
      var emailOfanswers=[]
      for(var proj in projects){
            emailOfanswers.push(projects[proj].email)
      }
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
   
        const bottomImages = this.props.answerProject.map((proj,key )=>(
            <div key={key}className="imagePeopleModal ">
                <img alt=" " id={proj.projectid} onClick={this.changeDisplay} src={proj.profilepic} className="peopleImage"></img>
            </div>
        ))
        if(this.state.element === this.state.video){
           
            displayElement  = (<div  ref={a=>this.imgDiv = a} className="audioModal">
            {/* <video  controls  src={this.props.questionProject.videofilepath}  >
   
</video> */}
            <video src={this.props.questionProject.videofilepath} controls  className="videoPlayer" ref={vid => this.videoExplain = vid} ></video>
            {/* <Player
    className="videoPlayer"
      ref={vid => this.videoExplain = vid}
      src={this.props.questionProject.videofilepath}
    /> */}
        
        </div>)
        }
        else{
            displayElement  = ( <div ref={a=>this.imgDiv = a} className="imageModal">
            <img alt=" " ref={img => this.imageExplain = img}src={this.props.questionProject.imgurl} width="100%" height="100%"></img>
        </div>)
        }
        return (
            <div className="issueCard issueModal">
                <div >
                   
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