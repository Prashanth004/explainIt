import React, { Component } from 'react'
import '../../../css/explainStories.css'
import { Button } from 'reactstrap'
import ReferComp from './referComponent'
export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            selected: null,
            referral:null
        })

        this.changeVideoSrc = this.changeVideoSrc.bind(this)
    }
    componentDidMount(){
        var test = document.querySelector('.explainVideoStoreis')
        test.addEventListener("mouseenter", function( event ) { 
            test.setAttribute("controls", "");
        })
        test.addEventListener("mouseleave", function(e){
            test.removeAttribute("controls");
        })
    }
    changeVideoSrc(e) {

        const clickedProject = (this.props.DetailsOfPeople).filter(projects =>
            projects.projectid === e.target.id)
        this.setState({
            selected: clickedProject[0].projectid,
            referral : clickedProject[0].referralid
        })
        this.video.src = clickedProject[0].videofilepath

    }
    render() {
        const referralDiv =(this.state.referral!== null)?(<ReferComp referralid ={this.state.referral}/>):(null)
        const imagesOfExplained = (this.props.DetailsOfPeople).map((people, index) =>
            <div key={people.projectid}
                className="explainedprofileImgDiv"
            >     <span className="hint--top" aria-label={"@"+people.twitterhandle}>
                <img 
                alt="profile pic"
                id={people.projectid}
                    onClick={this.changeVideoSrc}
                    style={{
                        height: (this.state.selected === people.projectid) ? "65px" : "55px",
                        width: (this.state.selected === people.projectid) ? "65px" : "55px",
                        marginTop:(this.state.selected === people.projectid) ? "0px" : "3px",

                    }}
                    src={people.profilepic}
                    className="explainedprofileImg" />
                    </span>
            </div>
        )
        return (
            <div className="storyContainer">
              
                <div>
                <Button close onClick={this.props.closeStoried} />
                    <div className="imagesOfExplainedDiv">
                        {imagesOfExplained}
                    </div>
                   
                   
                </div>
                <div className="explainedVideo">
                    <video
                        className="explainVideoStoreis"
                        controls 
                        src={this.props.DetailsOfPeople[0].videofilepath}
                        ref={a => this.video = a}
                        width="100%" height="100%" />
                    
                </div>
                <div className="referral">
                    {referralDiv}
                </div>
            </div>
        )
    }
}
