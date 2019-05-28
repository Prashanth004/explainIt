
import './landing.css'
import LeftSection from './leftSection.js'
import RightSection from './rightSection.js'
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect} from 'react-router-dom';
import { stillAuthenicated} from '../../../../actions/signinAction';


class landingPage extends Component {
  componentWillMount(){
    this.props.stillAuthenicated();
  }
  render() {
    return (!this.props.isAuthenticated?(<div className="landingContainer">
        <div className="leftSection">
          <LeftSection />
        </div>
        <div>
          <RightSection />

        </div>
      </div>):((<Redirect to={{ pathname: './application' }} />)))
  }
}


const mapStateToProps = function (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,

  }
}

export default connect(mapStateToProps,{stillAuthenicated})(landingPage);





