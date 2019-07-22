import React, { Component } from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiEdit } from "react-icons/fi";
import '../../../css/issueDetails.css';
import '../../../css/toggle.css'
import { FiTrash } from "react-icons/fi";
import { GoChevronDown } from "react-icons/go";
import { connect } from 'react-redux';
import PropType from 'prop-types';
import config from '../../../../config/config'
import { openEditModal } from '../../../../actions/projectActions'


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
        this.toggleDisplayLink = this.toggleDisplayLink.bind(this);
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
            this.setState({ optionVisibe: "visible" })
        else {
            this.setState({ optionVisibe: "hidden" })
        }
    }
    toggleDisplayLink(e) {
        var element = document.querySelector('#clipboard_' + e.currentTarget.id)
        if (element.style.display === 'none') {
            element.style.display = 'block'
        }
        else {
            element.style.display = 'none'
        }
    }

    openEditModal = (e) => {

        this.setState({ optionVisibe: "hidden" })
        this.props.openEditModal(e.target.id)
    }

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
        var date = this.props.issue.time.slice(5, 7);
        // <span style={datStyleYear}>{props.date.slice(8, 10)} {config.monthPicker[date]}</span>
        //             <br />
        //             <span style={datStyleDay}>{props.date.slice(0, 4)}</span>

        var profilePic = null;
        const defaultToggle = (Number(this.props.issue.public) === 1) ? true : false

        const createdMenuItems = (this.props.participated || !this.props.itsHome) ? (null) : (
            <div>
                <div id={this.props.issue.issueid} onClick={this.props.deleteProjects} className="menuItem menuTwoParts">

                    <div >
                        <span>  <FiTrash id={this.props.issue.issueid} className="menuIcon" /></span>
                    </div>
                    <div>
                        <span className="textInDropDown" id={this.props.issue.issueid}>Delete</span>
                    </div>
                </div>
                <div id={this.props.issue.projectid} className="menuItem menuTwoParts">

                    <div>
                        <span>  <FiEdit id={this.props.issue.projectid} onClick={this.openEditModal} className="menuIcon" /></span>
                    </div>
                    <div>
                        <span className="textInDropDown" id={this.props.issue.projectid} onClick={this.openEditModal} >Edit</span>
                    </div>
                </div>
            </div>
        )
        const publicPrivate = (this.props.participated || !this.props.itsHome) ? (
            null
        ) : (<div >
            <div className="privateOpt">
                <label id={this.props.issue.projectid}>
                    <span className="hint--top" aria-label={this.state.toolTipValue}>
                        <Toggle
                            id={this.props.issue.projectid}
                            defaultChecked={defaultToggle}
                            className='custom-classname'
                            icons={false}
                            onChange={this.changeToggle} />
                    </span>
                </label>
            </div>

        </div>)
        if (this.props.questionProject !== undefined) {
            profilePic = this.props.questionProject.profilepic
            var profileName = this.props.questionProject.username
            // var profiletwitterHandle = this.props.questionProject.twitterhandle

        }
        else {
            profilePic = null
        }


        const deleteDiv = (
            <div className="cardDropdown" >
                <div >
                    <span>
                        <GoChevronDown onClick={this.onOptClick} />
                    </span>
                </div>
                <div className="dropDownForOption drpOpt"
                    onMouseLeave={this.onOptClick} id={this.props.issue.issueid} style={{ visibility: this.state.optionVisibe }}>
                    {createdMenuItems}
                    <div className="menuItem menuTwoParts" id={this.props.issue.issueid} onClick={this.toggleDisplayLink}  >

                        <div >
                            <span>
                                <FiLink2 id={this.props.issue.issueid} className="menuIcon" />
                            </span>
                        </div>
                        <div>
                            <span className="textInDropDown">Shareable link</span>
                        </div>
                    </div>
                    {publicPrivate}

                </div>
            </div>
        )

        return (
            <div>
                <div id={this.props.issue.issueid} className="topButtons">
                    <div className="cardDate">
                    <span className="cardDateSpan" >{this.props.issue.time.slice(8, 10)}  {config.monthPicker[date]}, {this.props.issue.time.slice(0, 4)}</span>
                    </div>
                    <div className="seconBandTop">
                        <div className="profileCardDiv">
                            <div className="cardProfilePicDiv">
                                <img alt="button" src={profilePic}className="cardProfilePic"/>
                            </div>
                            <div className="cardProfileName">
                                <h5 ><b>{profileName}</b></h5>
                            </div>
                            <div></div>
                        </div>
                        <div id={this.props.issue.issueid} className="cardtwitterHolder">

                            {deleteDiv}
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}
displayTopBtns.PropType = {
    openEditModal: PropType.func.isRequired
};
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    participated: state.nav.openParticipated,


})

export default connect(mapStateToProps, {
    openEditModal
})(displayTopBtns)

