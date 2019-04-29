import React, { Component } from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiEdit, FiDelete } from "react-icons/fi";
import '../../css/issueDetails.css';
import '../../css/toggle.css'
import { FiTrash, FiMoreVertical } from "react-icons/fi";
import { GoChevronDown } from "react-icons/go";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {openEditModal} from '../../../actions/projectActions'


class displayTopBtns extends Component {
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
        this.openEditModal = this.openEditModal.bind(this);
    }
    componentDidMount() {
        if (Number(this.props.issue.public)) {
            this.setState({
                displayTwitter: "block",
                toolTipValue: "Public - anyone can see this card",
                toolTipsimple: "public"
            })
            this.props.changepublicStatus("public")
        }
        else {
            this.setState({
                displayTwitter: "none",
                toolTipValue: "Private - only you can see this card",
                toolTipsimple: "private"
            })
            this.props.changepublicStatus("private")
        }
    }
    onOptClick() {
        if (this.state.optionVisibe === "hidden")
            this.setState({optionVisibe: "visible"})
        else {
            this.setState({optionVisibe: "hidden"})
        }
    }


    openEditModal=(e)=>{

        this.setState({optionVisibe: "hidden"})
        this.props.openEditModal(e.target.id)}

    changeToggle(e) {
        if (this.state.displayTwitter === "block") {
            this.setState({
                displayTwitter: "none",
                toolTipValue: "Private - only you can see this card",
                toolTipsimple: "Private"
            })
            this.props.changepublicStatus("private")
        }
        else {
            this.setState({
                displayTwitter: "block",
                toolTipValue: "Public - anyone can see this card",
                toolTipsimple: "Public"
            })
            this.props.changepublicStatus("public")
        }
        this.props.handlePublicPrives(e)
    }

    render() {

        // const twitterBird = (Number(this.props.issue.public)) ? (
        //     >) : (null)
        if (this.props.questionProject !== undefined) {
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
            <div style={{fontSize:"13px", color:"#333"}}>
                <div className="iconsright">
                    <GoChevronDown onClick={this.onOptClick} />
                </div>
                <div className="dropDownForOption" 
                onMouseLeave={this.onOptClick}id={this.props.issue.issueid} style={{ visibility: this.state.optionVisibe }}>
                    <div id={this.props.issue.issueid} onClick={this.props.deleteProjects} className="menuItem">
                        
                        <div >
                            <span>  <FiTrash id={this.props.issue.issueid} className="menuIcon" /></span>
                        </div>
                        <div>
                            <span className="textInDropDown" id={this.props.issue.issueid} className="dropDownBtn">Delete</span>
                        </div>
                    </div>
                    <div id={this.props.issue.projectid} className="menuItem">
                       
                        <div>
                            <span>  <FiEdit id={this.props.issue.projectid} onClick={this.openEditModal}className="menuIcon" /></span>
                        </div>
                        <div>
                            <span className="textInDropDown" id={this.props.issue.projectid} onClick={this.openEditModal} className="dropDownBtn">Edit</span>
                        </div>
                    </div>
                    <div className="menuItem" id={this.props.issue.issueid}  onClick={this.props.toggleDisplayLink}  >
                        
                        <div >
                            <span>
                                <FiLink2 id={this.props.issue.issueid} className="menuIcon" />
                                </span>
                        </div>
                        <div>
                            <span className="textInDropDown">Sharable link</span>
                        </div>
                    </div>
                    <div >

                        <div className="privateOpt">
                            {/* <span style={{
                                display: "inline-block",
                                margin: "8px",
                                marginTop: "-10px",
                            }}>{this.state.toolTipsimple}</span> */}
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
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                                marginTop: "-8px",
                                marginLeft: "5px"
                            }} />

                        <span
                            className="ProfileNameCard">
                            {profileName}</span>
                            {/* <div className="date">
                {this.props.issue.date.slice(0,15)}
                </div> */}
                    </div>

                    <div id={this.props.issue.issueid} className="twitterHolder">
                        <div id={this.props.issue.issueid}  className="icons">
                           
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
displayTopBtns.PropType = {
    openEditModal:PropType.func.isRequired
   };
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,

})

export default connect(mapStateToProps, { 
    openEditModal
})(displayTopBtns)


// import React, {Component} from 'react'

// export default class componentName extends Component {
//   render() {
//     return (
//       <div>

//       </div>
//     )
//   }
// }

