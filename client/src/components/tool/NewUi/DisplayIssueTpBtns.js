import React, { Component } from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiEdit, FiDelete } from "react-icons/fi";
import '../../css/issueDetails.css';
import { FiTrash, FiMoreVertical } from "react-icons/fi";
import { GoChevronDown } from "react-icons/go";

export default class displayTopBtns extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayTwitter: "none",
            toolTipValue: "private",
            optionVisibe: "hidden",
            toolTipsimple: "public",

            // visible
        }
        this.changeToggle = this.changeToggle.bind(this);
        this.onOptClick = this.onOptClick.bind(this);
    }
    componentDidMount() {
        if (Number(this.props.issue.public)) {
            this.setState({
                displayTwitter: "block",
                toolTipValue: "Public - anyone can see this card",
                toolTipsimple: "public"
            })
        }
        else {
            this.setState({
                displayTwitter: "none",
                toolTipValue: "Private - only you can see this card",
                toolTipsimple: "private"
            })
        }
    }
    onOptClick() {
        if (this.state.optionVisibe === "hidden")
            this.setState({
                optionVisibe: "visible"
            })
        else {
            this.setState({
                optionVisibe: "hidden"
            })
        }
    }

    changeToggle(e) {
        if (this.state.displayTwitter === "block") {
            this.setState({
                displayTwitter: "none",
                toolTipValue: "Private - only you can see this card",
                toolTipsimple: "Private"
            })
        }
        else {
            this.setState({
                displayTwitter: "block",
                toolTipValue: "Public - anyone can see this card",
                toolTipsimple: "Public"
            })
        }
        this.props.handlePublicPrives(e)
    }

    render() {

        // const twitterBird = (Number(this.props.issue.public)) ? (
        //     >) : (null)
        if (this.props.questionProject !== undefined) {
            console.log("### this.props.questioProject : ", this.props.questionProject)
            var profilePic = this.props.questionProject.profilepic
            var profileName = this.props.questionProject.username

        }
        else {
            var profilePic = null
        }

        const publictoggle = (this.props.itsHome) ? (

            <label id={this.props.issue.projectid}>
                <span className="hint--top" aria-label={this.state.toolTipValue}>
                    <Toggle
                        id={this.props.issue.projectid}
                        defaultChecked={Number(this.props.issue.public)}
                        className='custom-classname'
                        icons={false}
                        onChange={this.changeToggle} />
                </span>
            </label>) : (null)

        const deleteDiv = (this.props.itsHome) ? (
            <div>
                <div className="iconsright">
                    <GoChevronDown onClick={this.onOptClick} />
                </div>
                <div className="dropDownForOption" id={this.props.issue.issueid} style={{ visibility: this.state.optionVisibe }}>
                    <div onClick={this.props.deleteProjects} className="menuItem">
                        <button id={this.props.issue.issueid} className="dropDownBtn">Delete</button>
                        <span>  <FiTrash id={this.props.issue.issueid} className="menuIcon" /></span>
                    </div>
                    <div className="menuItem">
                        <button id={this.props.issue.issueid} className="dropDownBtn">Edit</button>
                        <span>  <FiEdit id={this.props.issue.issueid} className="menuIcon" /></span>
                    </div>
                    <div className="menuItem">

                        <div className="privateOpt">
                            <span style={{
                                display: "inline-block",
                                margin: "8px",
                                marginTop: "-10px",
                            }}>{this.state.toolTipsimple}</span>
                            {publictoggle}
                        </div>

                    </div>
                </div>
            </div>
        ) : (null)

        return (
            <div>
                <div id={this.props.issue.issueid} className="topButtons">
                    <div className="profileCardDiv">
                        <img src={profilePic}
                            style={{
                                width: "41px",
                                height: "41px",
                                borderRadius: "50%",
                                marginTop: "-8px",
                                marginLeft: "5px"
                            }} />

                        <span
                            className="ProfileNameCard">
                            <b>{profileName}</b></span>
                            <div className="date">
                {this.props.issue.date.slice(0,15)}
                </div>
                    </div>

                    <div id={this.props.issue.issueid} className="twitterHolder">
                        <div id={this.props.issue.issueid} onClick={this.props.toggleDisplayLink} className="icons">
                            <span id={this.props.issue.issueid} className="hint--top" aria-label="Get shareable Link">
                                <FiLink2 id={this.props.issue.issueid} className="linkElementSym" id={this.props.issue.issueid} />
                            </span>
                        </div>
                        {deleteDiv}
                        {/* <button  id={this.props.issue.issueid} className="buttonDark twitterBtn"
                       onClick={this.tweetWindow}><i class="fa fa-twitter twitterBtn">  Tweet</i></button> */}

                    </div>
                </div >
            </div>
        )
    }
}


// import React, {Component} from 'react'

// export default class componentName extends Component {
//   render() {
//     return (
//       <div>

//       </div>
//     )
//   }
// }

