import React from 'react';
import config from '../../../config/config';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FiMail } from "react-icons/fi";
import '../../css/nav.css';
import '../../css/issueDetails.css';
import { FiPower } from "react-icons/fi";
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { confirmAlert } from 'react-confirm-alert';
import { stillAuthenicated, signout } from '../../../actions/signinAction';
import { signInWithGoogle, twitterAuthFailure, signInWithTwitter } from '../../../actions/signinAction';
import { openHome, openInbox, openCreated, openParticipated } from '../../../actions/navAction'

class Navigationbar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      isViewPage: false,
      isProjectPage: false,
      optionVisibe: "hidden"
    };
    this.googleResponse = this.googleResponse.bind(this);
    this.handleGit = this.handleGit.bind(this);
    this.openHome = this.openHome.bind(this);
    this.openParticipated = this.openParticipated.bind(this);
    this.openCreated = this.openCreated.bind(this);
    this.openVisitHome = this.openVisitHome.bind(this);
    this.logout = this.logout.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  logout = () => {
    const message = this.props.isSceenSharing ? "The call will get disconnected" : "The ongoing screen recording will end"
    if ((this.props.isSceenSharing || this.props.isFullScreenRecording)) {

      confirmAlert({
        title: "Are you sure?",
        message: message,
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.handleConfirm()
          },
          {
            label: 'No',
            onClick: () => this.handleCancel()
          }
        ]
      })
    }
    else {
      this.handleConfirm()
    }
  }
  handleCancel = () => {

  }
  handleConfirm() {
    this.props.signout()
  }
  componentWillMount() {
    this.props.stillAuthenicated()
    if (this.props.page !== undefined && this.props.page === "profile")
      // if(window.location.href.includes('profile') ){
      this.setState({
        isViewPage: true
      })
    if (this.props.page !== undefined && this.props.page === "project") {
      this.setState({
        isProjectPage: true
      })
    }

    // }
  }
  openParticipated() {
    this.props.openParticipated()
    this.setState({ state: this.state });
  }
  openCreated() {
    this.props.openCreated()
    this.setState({ state: this.state });
  }
  openHome() {
    if (!(window.location.pathname).includes('application'))
      window.open(config.react_url + '/application', '_self')
    else {
      if (this.props.isSceenSharing || this.props.isFullScreenRecording)
        window.open(config.react_url + '/application', '_blank')
      else
        this.props.openHome()

    }

  }

  handleGit() {
    var url = `https://github.com/login/oauth/authorize?client_id=${config.gitHubClientId}&scope=user&redirect_uri=${config.react_url_git}`
    window.open(url, '_self')
  }
  googleResponse(response) {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    this.props.signInWithGoogle(tokenBlob)
  }
  toggleDropDown() {
    if (this.state.optionVisibe === "hidden")
      this.setState({ optionVisibe: "visible" })
    else {
      this.setState({ optionVisibe: "hidden" })
    }
  }
  openVisitHome() {

    window.open(config.react_url + "/" + this.props.twitterHandle, '_self')

  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    var createdStyle = null;
    var partiStyle = null;
    // var inboxStyle = null;
    var profileImage = null;
    var centreNav = null;
    var explainLogo = (
      <div className="logoContainer" onClick={this.openHome}>
        <span>
          <img alt="open home" src={require('../../images/logo.png')}
            width="100%"
            height="100%"></img>
        </span>
      </div>)
    if (this.props.Created) {
      createdStyle = {
        color: "#d3a5cd",

      }
    }
    else if (this.props.Participated) {
      partiStyle = {
        color: "#d3a5cd",

      }
    }
    else if (this.props.inbox) {
      var inboxColor = "#d3a5cd"
    }


    if ((this.props.Created || this.props.Participated)
      && this.state.isViewPage
      && !this.props.isAuthenticated) {
      profileImage = (null);

    }
    else {
      profileImage = (this.props.authAction) ? (!this.props.isAuthenticated) ? (null) : (
        <div className="cardDropdown" >
          <div className="profileImagesDiv">
            <span>
              <img alt="profilr pic" className="profileImages" onClick={this.toggleDropDown} src={this.props.profilePic}></img>
            </span>
          </div>
          <div className="dropDownForOption drpLogout"
            onMouseLeave={this.toggleDropDown} style={{ visibility: this.state.optionVisibe, width: "120px", height: "40px", marginLeft: "-50px", marginTop: "3px" }}>
            <div className="menuItem" >
              <div ><span onClick={this.logout}><FiPower /></span></div>
              <div>
                <span onClick={this.logout} className> Logout</span>
              </div>
            </div>
          </div>
        </div>) : (null)

    }



    if ((this.props.Created || this.props.Participated || this.props.inbox) && !this.state.isViewPage) {

      centreNav = (<div className="navgation">
        <div onClick={this.openCreated} className="normalNav">
          <button style={createdStyle} className="noButtons"><span>Created</span></button>
        </div>
        <div className="logoCentre">
        <div className="pImageContainer">
              <span>
                <FiMail style={{marginTop:"10px",marginLeft:"8px", fontSize:"30px", color:inboxColor}} onClick={this.props.openInbox}
                />
              </span>

            </div>                </div>
        <div className="normalNav">
          <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><span>Participated</span></button>
        </div>
      </div>)
    }

    else if (this.state.isViewPage || (this.state.isProjectPage && !this.props.isAuthenticated)) {

      if ((this.props.Created || this.props.Participated)) {
        centreNav = (<div className="navgation">
          <div onClick={this.openCreated} className="normalNav">
            <button onClick={this.openCreated} style={createdStyle} className="noButtons"><span>Created</span></button>
          </div>
          <div className="logoCentre">

            <div className="pImageContainer">
              <span>
                <img alt="profile pic" src={this.props.otherprofilePic}
                  onClick={this.props.openInbox}
                  className="labelProfilePicNav"></img>
              </span>

            </div>
          </div>
          <div className="normalNav">
            <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><span>Participated</span></button>
          </div>
        </div>)
      }
      else {
      }

    }
    else {

      // centreNav = (<SearchBar />)
    }
    const content = (<div className="navBar">
      <div className="logo">
        {explainLogo}

      </div>
      <div >
        {centreNav}

      </div>
      <div className="navItem">
        <div></div>
        <div>
          {profileImage}
        </div>

      </div>
    </div>)

    return (
      <div>
        {content}
      </div>
    );
  }
}

Navigationbar.PropType = {
  stillAuthenicated: PropType.func.isRequired,
  signout: PropType.func.isRequired,
  signInWithGoogle: PropType.func.isRequired,
  signInWithTwitter: PropType.func.isRequired,
  twitterAuthFailure: PropType.func.isRequired,
  openHome: PropType.func.isRequired,
  openCreated: PropType.func.isRequired,
  openParticipated: PropType.func.isRequired,
  openInbox: PropType.func.isRequired

};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userName: state.auth.userName,
  isSceenSharing: state.tools.isFullScreenSharing,
  isFullScreenRecording: state.tools.isFullScreenRecording,
  screenAction: state.tools.screenAction,
  isSharingCompleted: state.tools.isSharingCompleted,
  isFullSharingCompleted: state.tools.isFullSharingCompleted,
  profilePic: state.auth.profilePic,
  logoutSuccess: state.auth.logoutSuccess,
  userId: state.auth.id,
  Home: state.nav.openHome,
  Created: state.nav.openCreated,
  inbox: state.nav.openInbox,
  Participated: state.nav.openParticipated,
  authAction: state.auth.authAction,
  otherprofilePic: state.profile.profilePic,


})
export default connect(mapStateToProps, { openHome, openInbox, openCreated, openParticipated, stillAuthenicated, signInWithGoogle, twitterAuthFailure, signInWithTwitter, signout })(Navigationbar)



