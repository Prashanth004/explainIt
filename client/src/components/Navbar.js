import React from 'react';
import {Redirect} from  'react-router-dom';
import { Link } from 'react-router-dom';
// import './css/nav.css';
import config from '../config/config';
import PropType from  'prop-types'; 
import {connect} from 'react-redux';
import {stillAuthenicated, signout } from '../actions/signinAction';
import { signInWithGoogle,twitterAuthFailure,signInWithTwitter } from '../actions/signinAction';

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
  DropdownItem ,Button} from 'reactstrap';
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
componentWillMount(){
  this.props.stillAuthenicated()
}
handleGit(){
  var url = `https://github.com/login/oauth/authorize?client_id=${config.gitHubClientId}&scope=user&redirect_uri=${config.react_url_git}`
  window.open(url,'_self')
}
googleResponse(response) {
  const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
  this.props.signInWithGoogle(tokenBlob)
}

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const content = !!this.props.isAuthenticated?
    (
      <Navbar className="navBar" light expand="md">
      <NavbarBrand href="/">Explain</NavbarBrand>
      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
        
          <NavItem>
          <NavLink href="#"> {this.props.userName}</NavLink>
         
          </NavItem>
          <NavItem>
          <div className="profileImagesDiv">
        <img  className="profileImages" src={this.props.profilePic}></img>
            </div>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
               Settings
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
              <button onClick={this.props.signout} className=" buttonLight navButton1">logout</button>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
//       <div className="bodyWhole">
//       <ul>
//       <li ><div className="navleft">
//      Explain</div></li>
//       </ul>
//       <ul>
   

// <li><button onClick={this.props.signout} className="buttonLight">logout</button></li>
// <li>
//   <div className="profileImagesDiv">
//   <img  className="profileImages" src={this.props.profilePic}></img>
//   </div>
// </li >
// <li>{this.props.userName}</li>

// </ul>
// <div>

// </div>

//     </div>
    ):(
      <Navbar className="navBar" light expand="md">
      <NavbarBrand href="/">Explain</NavbarBrand>
      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
        <NavItem>
        <NavLink href="#">Login with </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#"><GoogleLogin
                                    clientId={config.googleClientId}
                                    render={renderProps => (
                                        <button className="buttonDark navButton2"  onClick={renderProps.onClick}>Google</button>
                                    )}
                                    buttonText="Login"
                                    onSuccess={this.googleResponse}
                                    onFailure={this.responseGoogle}
                                />   </NavLink>
          </NavItem>
          <NavItem>
          <NavLink href="#"><button className="buttonDark navButton2" onClick={this.handleGit}>Github</button></NavLink>
          

         
          </NavItem>
          </Nav>
          </Collapse>
        </Navbar>

      
//       <div className="bodyWhole">
//         <ul>
  
//   <li><button className="buttonDark navButton2"><Link className="LinkBtn"to='/newlogin'>signup</Link></button></li>
//   <li><button className=" buttonLight navButton1"><Link to='/newlogin'>login</Link></button></li>
// </ul>
// <div>

// </div>

//       </div>
  

    )
    
    return (
      <div>
{content}



      </div>
    );
  }
}

Navigationbar.PropType={
  stillAuthenicated:PropType.func.isRequired,
  signout:PropType.func.isRequired,
  signInWithGoogle : PropType.func.isRequired
}; 
const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated,
  userName : state.auth.userName,
  profilePic : state.auth.profilePic
})

export default connect(mapStateToProps, {stillAuthenicated, signInWithGoogle,twitterAuthFailure,signInWithTwitter, signout })(Navigationbar)
