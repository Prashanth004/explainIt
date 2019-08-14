
import './landing.css'
// import LeftSection from './leftSection.js'
import RightSection from './rightSection.js'
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {initGA,loadPageView} from '../container/ReactGa';
import { Redirect } from 'react-router-dom';
import { stillAuthenicated } from '../../../../actions/signinAction';
// import Loading from '../container/loadingAmin'
import '../container/loading.css'


class landingPage extends Component {
  componentWillMount() {
    this.props.stillAuthenicated();
  }
  componentDidMount() {
    initGA();
    loadPageView();
  }
  render() {
    return (this.props.authAction) ? (((!this.props.isAuthenticated ||  !this.props.activeStatus)? (<div className="landingContainer">
      {/* <div className="leftSection">
        <LeftSection />
      </div> */}
      <div>
        <RightSection />
      </div>
    </div>) :((<Redirect to={{ pathname: './@'+this.props.authTwitterHandle }} />)))) :
      ( <div style={{paddingTop:"150px"}}>
        <div className="fluct"></div>
      </div>)
  }
}


const mapStateToProps = function (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    authAction: state.auth.authAction,
    activeStatus:state.auth.activeStatus,
    doneVarification : state.email.doneVarification,
    isVarified:state.email.isVarified,
    authTwitterHandle: state.auth.twitterHandle,

  }
}

export default connect(mapStateToProps, {stillAuthenicated })(landingPage);





