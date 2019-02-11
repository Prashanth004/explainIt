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
    const content = !!this.props.isAuthenticated?(
      <div className="bodyWhole">
      <ul>

<li><button onClick={this.props.signout} className=" buttonLight navButton1">logout</button></li>
</ul>
<div>

</div>

    </div>
    ):(
      
      <div className="bodyWhole">
        <ul>
  
  <li><button className="buttonDark navButton2"><Link className="LinkBtn"to='/newlogin'>signup</Link></button></li>
  <li><button className=" buttonLight navButton1"><Link to='/newlogin'>login</Link></button></li>
</ul>
<div>

</div>

      </div>
  

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
})

export default connect(mapStateToProps, {stillAuthenicated, signout })(Navigationbar)
