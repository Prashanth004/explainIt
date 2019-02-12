import React from 'react';
import {Redirect} from  'react-router-dom';
import { Link } from 'react-router-dom';
// import './css/nav.css';
import PropType from  'prop-types'; 
import {connect} from 'react-redux';
import {stillAuthenicated, signout } from '../actions/signinAction'

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

  }
componentWillMount(){
  this.props.stillAuthenicated()
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
            <NavLink href="/">Home</NavLink>
          </NavItem>
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
            <NavLink href="/newlogin">Login</NavLink>
          </NavItem>
          <NavItem>
          <NavLink href="#"><button className="buttonDark navButton2">signup</button></NavLink>
         
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
}; 
const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated,
  userName : state.auth.userName,
  profilePic : state.auth.profilePic
})

export default connect(mapStateToProps, {stillAuthenicated, signout })(Navigationbar)
