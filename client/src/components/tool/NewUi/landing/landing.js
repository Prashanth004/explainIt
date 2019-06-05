
import './landing.css'
import LeftSection from './leftSection.js'
import RightSection from './rightSection.js'
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { stillAuthenicated } from '../../../../actions/signinAction';


class landingPage extends Component {
  componentWillMount() {
    this.props.stillAuthenicated();
  }
  render() {
    return (this.props.authAction) ? ((!this.props.isAuthenticated ? (<div className="landingContainer">
      <div className="leftSection">
        <LeftSection />
      </div>
      <div>
        <RightSection />

      </div>
    </div>) : ((<Redirect to={{ pathname: './application' }} />)))) :
      (
        <div className="loadinContainerDiv">
          <div className="loader"></div>

        </div>
      )
  }
}


const mapStateToProps = function (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    authAction: state.auth.authAction,
  }
}

export default connect(mapStateToProps, { stillAuthenicated })(landingPage);





