import React from 'react';
import config from '../../../config/config';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FiMail } from "react-icons/fi";
import '../../css/nav.css';
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
      isProjectPage: false
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
  }
  showLogoutSuccess() {
    // Swal.fire({
    //   type: 'success',
    //   title: 'Logout successful',
    //   timer: 1500,
    //   showConfirmButton: false,
    // })
  }
  logout = () => {
    
    if (this.props.screenAction !== null && !this.props.isSharingCompleted && !this.props.isFullSharingCompleted) {

        confirmAlert({
            title: "Are you sure?",
            message: "The call will get disconnected",
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
handleCancel=()=>{

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
    if ((window.location.pathname).length > 1)
      window.open(config.react_url, '_self')
    else {
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
    var inboxStyle = null;
    var explainLogo = (
      <div className="logoContainer" onClick={this.openHome}>
        <span>
          <img src={require('../../images/logo.png')}
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
    else if(this.props.inbox){
      inboxStyle = {
        color: "#d3a5cd",

      }
    }
    var centreNav = null;


    if ((this.props.Created || this.props.Participated)
      && this.state.isViewPage
      && !this.props.isAuthenticated) {
      var profileImage = (null)
      {/* <div>
  <button className="buttonDark" 
  style={{marinTop:"-50px"}}>Login</button>
</div>) */}
    }
    else {
      var profileImage = (this.props.authAction) ? (!this.props.isAuthenticated) ? (null) : (<div className="dropdown">
        <div className="profileImagesDiv">
          <img className="profileImages" src={this.props.profilePic}></img>
        </div>
        <div className="dropdown-content">
          <button onClick={this.logout} className=" buttonLight navButton1"> Logout</button>
          <div className="imageLogout">
            <span>
              <img onClick={this.logout} height="100%" width="100%" src={require('../../images/logout.png')} />
            </span>
          </div>
        </div>
      </div>) : (null)
    }



    if ((this.props.Created || this.props.Participated || this.props.inbox) && !this.state.isViewPage) {

      centreNav = (<div className="navgation">
        <div onClick={this.openCreated} className="normalNav">
          <button onClick={this.openCreated} style={createdStyle} className="noButtons"><a>Created</a></button>
        </div>
        <div className="logoCentre Create">
          <div className="logoContainerCreate" >
            <span>
              <FiMail onClick={this.props.openInbox} style={inboxStyle} className="dragoMail" />
            </span>
          </div>                  </div>
        <div className="normalNav">
          <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><a>Participated</a></button>
        </div>
      </div>)
    }

    else if (this.state.isViewPage || (this.state.isProjectPage && !this.props.isAuthenticated)) {
      
      if ((this.props.Created || this.props.Participated)) {
        centreNav = (<div className="navgation">
          <div onClick={this.openCreated} className="normalNav">
            <button onClick={this.openCreated} style={createdStyle} className="noButtons"><a>Created</a></button>
          </div>
          <div className="logoCentre">
            <div className="logoContainerCreate" >
              <span>
                <FiMail onClick={this.props.openInbox} className="dragoMail" />
              </span>
            </div>                  </div>
          <div className="normalNav">
            <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><a>Participated</a></button>
          </div>
        </div>)
      }
      else {

        centreNav = (
          <div className="navgation">
            <div>

            </div>
            <div className="  " onClick={this.openVisitHome}>
              <span>
                <img src={require('../../images/logo.png')}
                  width="100%"
                  height="100%"></img>
              </span>
            </div>
          </div>)
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
        <div>

        </div>
        <div></div>
        <div >
        </div>
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


})
export default connect(mapStateToProps, { openHome, openInbox, signInWithTwitter, openCreated, openParticipated, twitterAuthFailure, stillAuthenicated, signInWithGoogle, twitterAuthFailure, signInWithTwitter, signout })(Navigationbar)



