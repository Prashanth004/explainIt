
import React, { Component } from 'react';
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import config from '../../../../config/config';
import '../../../css/ExplainpPage.css';
import { twitterAuthFailure, signInWithTwitter } from '../../../../actions/signinAction';

class Signin extends Component {
  constructor(props){
    super(props)
    this.state = {istwitterPressed :false };
    this.twitterPressed = this.twitterPressed.bind(this);
  }
  twitterPressed(){
    this.setState({istwitterPressed:true})
  }
  render() {
    const twitterButton = !this.props.isAuthenticated ? ((this.state.istwitterPressed && !this.props.twitterLoginFailed)?(
          (<p>Redirecting ..</p>)):(<div onClick={this.twitterPressed} className="buttonDiv">
        <TwitterLogin className="buttonDark homeTwitterButton" loginUrl={config.base_dir + "/api/twitter/visit/auth/twitter"}
          onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
          requestTokenUrl={config.base_dir + "/api/twitter/auth/twitter/reverse"} />
      </div>)):(!this.props.activeStatus?(<p>Thank you {this.props.userName}. We will get back to once we are ready!</p>):(null))
    return (
      <div>
        {twitterButton}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  twitterLoginFailed:state.auth.twitterLoginFailed,
  activeStatus:state.auth.activeStatus,
  userName:state.auth.userName


})

export default connect(mapStateToProps, {

  twitterAuthFailure,
  signInWithTwitter
})(Signin)


