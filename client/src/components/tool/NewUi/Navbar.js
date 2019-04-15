import React from 'react';
import BasicAutocomplete from './search3'
import { Link } from 'react-router-dom';
import config from '../../../config/config';
import PropType from 'prop-types';
// import SearchBar from './Search'
import { connect } from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import Swal from 'sweetalert2';
import '../../css/nav.css'
import { stillAuthenicated, signout } from '../../../actions/signinAction';
import { signInWithGoogle, twitterAuthFailure, signInWithTwitter } from '../../../actions/signinAction';
import { openHome, openCreated, openParticipated } from '../../../actions/navAction'

class Navigationbar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      isViewPage: false,
      isProjectPage:false
    };
    this.googleResponse = this.googleResponse.bind(this);
    this.handleGit = this.handleGit.bind(this);
    this.openHome = this.openHome.bind(this);
    this.openParticipated = this.openParticipated.bind(this);
    this.openCreated = this.openCreated.bind(this);
    this.openVisitHome = this.openVisitHome.bind(this);
  }
  showLogoutSuccess() {
    // Swal.fire({
    //   type: 'success',
    //   title: 'Logout successful',
    //   timer: 1500,
    //   showConfirmButton: false,
    // })
  }
  componentWillMount() {
    this.props.stillAuthenicated()
    console.log("window.location.href : ", window.location.href)
    if (this.props.page !== undefined && this.props.page === "profile")
      // if(window.location.href.includes('profile') ){
      this.setState({
        isViewPage: true
      })
      if(this.props.page !==undefined && this.props.page ==="project"){
        this.setState({
          isProjectPage :true
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
    var partiStyle = null
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
    var centreNav = null;


if ((this.props.Created || this.props.Participated)
&& this.state.isViewPage
&& !this.props.isAuthenticated) {
var profileImage=(null)
{/* <div>
  <button className="buttonDark" 
  style={{marinTop:"-50px"}}>Login</button>
</div>) */}
}
else{
  var profileImage= (this.props.authAction) ? (!this.props.isAuthenticated) ? (null) : (<div className="dropdown">
  <div className="profileImagesDiv">
    <img className="profileImages" src={this.props.profilePic}></img>
  </div>
  <div className="dropdown-content">
    <button onClick={this.props.signout} className=" buttonLight navButton1"> Logout</button>
    <div className="imageLogout">
      <span>
        <img onClick={this.props.signout} height="100%" width="100%" src={require('../../images/logout.png')} />
      </span>
    </div>
  </div>
</div>) : (null)
}



if ((this.props.Created || this.props.Participated) && !this.state.isViewPage) {
      var explainLogo = null
      centreNav = (<div className="navgation">
        <div onClick={this.openCreated} className="normalNav">
          <button onClick={this.openCreated} style={createdStyle} className="noButtons"><a>Created</a></button>
        </div>
        <div className="logoCentre Create">
          <div className="logoContainerCreate" onClick={this.openHome}>
            <span>
              <img src={require('../../images/logo5.png')}
                width="100%"
                height="100%"></img>
            </span>
          </div>                  </div>
        <div className="normalNav">
          <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><a>Participated</a></button>
        </div>
      </div>)
    }

    else if (this.state.isViewPage || (this.state.isProjectPage && !this.props.isAuthenticated)){
      if ((this.props.Created || this.props.Participated)) {
        var explainLogo = null
        centreNav = (<div className="navgation">
          <div onClick={this.openCreated} className="normalNav">
            <button onClick={this.openCreated} style={createdStyle} className="noButtons"><a>Created</a></button>
          </div>
          <div className="logoCentre">
            <div className="logoContainerCreate" onClick={this.openVisitHome}>
              <span>
                <img src={require('../../images/logo5.png')}
                  width="100%"
                  height="100%"></img>
              </span>
            </div>                  </div>
          <div className="normalNav">
            <button onClick={this.openParticipated} style={partiStyle} className="noButtons"><a>Participated</a></button>
          </div>
        </div>)
      }
      else {
        var explainLogo = null;
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
      var explainLogo = (
        <div className="logoContainer" onClick={this.openHome}>
          <span>
            <img src={require('../../images/logo.png')}
              width="100%"
              height="100%"></img>
          </span>
        </div>)
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

          {/* <BasicAutocomplete
      items={['apple', 'orange', 'carrot']}
      onChange={selectedItem => console.log(selectedItem)}
    /> */}
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
  openParticipated: PropType.func.isRequired

};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userName: state.auth.userName,
  profilePic: state.auth.profilePic,
  logoutSuccess: state.auth.logoutSuccess,
  userId: state.auth.id,
  Home: state.nav.openHome,
  Created: state.nav.openCreated,
  Participated: state.nav.openParticipated,
  authAction: state.auth.authAction,


})
export default connect(mapStateToProps, { signInWithTwitter, openHome, openCreated, openParticipated, twitterAuthFailure, stillAuthenicated, signInWithGoogle, twitterAuthFailure, signInWithTwitter, signout })(Navigationbar)



