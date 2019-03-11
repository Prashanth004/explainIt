import React from 'react';

import { Link } from 'react-router-dom';
import config from '../../../config/config';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import Swal from 'sweetalert2';
import '../../css/nav.css'
import { stillAuthenicated, signout } from '../../../actions/signinAction';
import { signInWithGoogle, twitterAuthFailure, signInWithTwitter } from '../../../actions/signinAction';

import GoogleLogin from 'react-google-login'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Button
} from 'reactstrap';
class Navigationbar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
    this.googleResponse = this.googleResponse.bind(this);
    this.handleGit = this.handleGit.bind(this)
  }
  showLogoutSuccess() {
    Swal.fire({
      type: 'success',
      title: 'Logout successful',
      timer: 1500,
      showConfirmButton: false,
   })
  }
  componentWillMount() {
    this.props.stillAuthenicated()
  }
  handleGit() {
    var url = `https://github.com/login/oauth/authorize?client_id=${config.gitHubClientId}&scope=user&redirect_uri=${config.react_url_git}`
    window.open(url, '_self')
  }
  googleResponse(response) {
    const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
    this.props.signInWithGoogle(tokenBlob)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    if (this.props.logoutSuccess) {
      this.showLogoutSuccess()
    }
 const content = 
 !!this.props.isAuthenticated ?
      
        (<Navbar className="navBar" light expand="md">
          <NavbarBrand href="/"><a className="brandName">Explain</a></NavbarBrand>
          
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>
            <NavLink href={"/inbox/"+this.props.userId}>Inbox</NavLink>
          </NavItem>
         
              <UncontrolledDropdown nav inNavbar>
                <div className="dropdown">
                  <div className="profileImagesDiv">
                    <img className="profileImages" src={this.props.profilePic}></img>
                  </div>
                  <div className="dropdown-content">
                  <button onClick={this.props.signout} className=" buttonLight navButton1"> Logout</button>
                  <div className="imageLogout">
                  <img onClick={this.props.signout} height="100%" width="100%" src={require('../../images/logout.png')} />

                  </div>

                  </div>
                </div>

              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      ) 
      : (
        <div><p></p></div>
       )
        // <Navbar className="navBar" light expand="md">
        //   <NavbarBrand href="/">Explain</NavbarBrand>
        //   <NavbarToggler onClick={this.toggle} />
        //   <Collapse isOpen={this.state.isOpen} navbar>
        //     <Nav className="ml-auto" navbar>
        //       <NavItem>
        //         <NavLink href="#">Login with </NavLink>
        //       </NavItem>
        //       <NavItem>
        //         <NavLink href="#"><GoogleLogin
        //           clientId={config.googleClientId}
        //           render={renderProps => (
        //             <button className="buttonDark navButton2" onClick={renderProps.onClick}>Google</button>
        //           )}
        //           buttonText="Login"
        //           onSuccess={this.googleResponse}
        //           onFailure={this.responseGoogle}
        //         />   </NavLink>
        //       </NavItem>
        //       <NavItem>
        //         <NavLink href="#"><button className="buttonDark navButton2" onClick={this.handleGit}>Github</button></NavLink>
        //       </NavItem>
        //       <NavItem>
        //           <TwitterLogin className="buttonDark navButton2" loginUrl={config.base_dir+"/twitter/auth/twitter"}
        //               onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
        //               requestTokenUrl={config.base_dir+"/twitter/auth/twitter/reverse"} />
        //       </NavItem>
        //     </Nav>
        //   </Collapse>
        // </Navbar>
      // )
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
  signInWithTwitter : PropType.func.isRequired,
  twitterAuthFailure : PropType.func.isRequired
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  userName: state.auth.userName,
  profilePic: state.auth.profilePic,
  logoutSuccess: state.auth.logoutSuccess,
  userId : state.auth.id

})
export default connect(mapStateToProps, { signInWithTwitter, twitterAuthFailure, stillAuthenicated, signInWithGoogle, twitterAuthFailure, signInWithTwitter, signout })(Navigationbar)
