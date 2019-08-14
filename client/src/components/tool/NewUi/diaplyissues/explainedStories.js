import React, { Component } from 'react'
import '../../../css/explainStories.css'
import { Button } from 'reactstrap'
import ReferComp from './referComponent'
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {FiChevronLeft,FiChevronRight} from "react-icons/fi";
import {FiArrowLeft} from "react-icons/fi";
export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            selected: null,
            referral: null
        })

        this.changeVideoSrc = this.changeVideoSrc.bind(this)
    }
    componentDidMount() {
        var test = document.querySelector('.explainVideoStoreis')
        test.addEventListener("mouseenter", function (event) {
            test.setAttribute("controls", "");
        })
        test.addEventListener("mouseleave", function (e) {
            test.removeAttribute("controls");
        })
    }
    changeVideoSrc(e) {

        const clickedProject = (this.props.DetailsOfPeople).filter(projects =>
            projects.projectid === e.target.id)
        this.setState({
            selected: clickedProject[0].projectid,
            referral: clickedProject[0].referralid
        })
        this.video.src = clickedProject[0].videofilepath;
        // this.text.innerText = clickedProject[0].textexplain;


    }
    render() {

        const ArrowLeft =  <FiChevronLeft className="explaintArrow" />;
        const ArrowRight =  <FiChevronRight className="explaintArrow"  />
      
        const referralDiv = (this.state.referral !== null) ? (<ReferComp referralid={this.state.referral} />) : (null)
        const imagesOfExplained = (this.props.DetailsOfPeople).map((people, index) =>
        <div className="explainedExtImagCover"
        style={{
           
            borderWidth:"1px",
            borderColor:"#40a8ac"
        }}
        // (this.state.selected === people.projectid)?"2.5px":
        // (this.state.selected === people.projectid)?"black":
            >
            <div key={people.projectid}
                className="explainedprofileImgDiv"
                style={{
              
                borderColor: (this.state.selected === people.projectid) ?"rgb(209, 97, 22)":"#40a8ac",
                // backgroundColor:(this.state.selected === people.projectid)?"rgb(209, 97, 22)":"white"
            }}
            >     <span className="hint--top" aria-label={"@" + people.twitterhandle}>
                   
                        <img
                            alt="profile pic"
                            id={people.projectid}
                            onClick={this.changeVideoSrc}
                            src={people.profilepic}
                          
                            className="explainedprofileImg" />
                  
                </span>
            </div>
            <span    style={{ display: (this.state.selected === people.projectid) ?"block":"none" ,
               width:"100%",whiteSpace: "nowrap",height:"15px",fontWeight:"350",
               overflow: "hidden", fontSize:"12px"}}>{"@" + people.twitterhandle}</span>

            </div>
        )
        // explainedExtImagCover
        const scrollImages = (this.props.DetailsOfPeople.length<9)?( <div className="imagesOfExplainedDiv">
        {imagesOfExplained}
    </div> ):( <ScrollMenu
          data={imagesOfExplained}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          onSelect={()=>{}}
        /> )
        return (
            <div className="storyContainer animated slideInUp faster">
                <span>
  <FiArrowLeft style={{float:"left", fontSize: "17px",marginTop:"30px",marginLeft:"10px",color:"rgb(56, 56, 56)"}} close onClick={this.props.closeStoried} />
  </span>
                <div>
              
                </div>

                {/* <div className="epxlainedText">
                    <p  ref={a => this.text = a}>{this.props.DetailsOfPeople[0].textexplain}</p>
                </div> */}
                <div className="explainedVideo">
                    <video
                        className="explainVideoStoreis"
                        controls
                        src={this.props.DetailsOfPeople[0].videofilepath}
                        ref={a => this.video = a}
                        width="80%" height="100%" style={{ borderRadius: "5px" }} />
                </div>
                <div className="referral">
                    {referralDiv}
                </div>
                <div className="imagesDisplay">
                {scrollImages}
        </div>

            </div>
        )
    }
}
// #40a8ac
