import React, { Component } from 'react'
import '../../css/explainStories.css'
import { Button } from 'reactstrap'
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            selected: null
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
            selected: clickedProject[0].projectid
        })
        this.video.src = clickedProject[0].videofilepath

    }
    render() {
        const imagesOfExplained = (this.props.DetailsOfPeople).map((people, index) =>
            <div key={people.projectid}
                className="explainedprofileImgDiv"
            >
                <img id={people.projectid}
                    onClick={this.changeVideoSrc}
                    style={{
                        height: (this.state.selected === people.projectid) ? "65px" : "55px",
                        width: (this.state.selected === people.projectid) ? "65px" : "55px",
                        marginTop:(this.state.selected === people.projectid) ? "0px" : "3px",

                    }}
                    src={people.profilepic}
                    className="explainedprofileImg" />
            </div>
        )
        return (
            <div className="storyContainer">
                <Button close onClick={this.props.toggleAllPeopleList} />
                <div>
                    {/* <div className="arrow">
                        <span><FiChevronLeft /></span>
                        </div> */}
                    <div className="imagesOfExplainedDiv">
                        {imagesOfExplained}
                    </div>
                    {/* <div className="arrow">
                    
                    <span><FiChevronRight /></span>
                    </div> */}
                   
                </div>
                <div className="explainedVideo">
                    <video
                        className="explainVideoStoreis"
                        controls 
                        src={this.props.DetailsOfPeople[0].videofilepath}
                        ref={a => this.video = a}
                        width="100%" height="100%" />
                </div>
            </div>
        )
    }
}
