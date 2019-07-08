import React from 'react';
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import config from '../../../../config/config';
import '../../../css/ExplainpPage.css';
import { twitterAuthFailure,signInWithTwitter } from '../../../../actions/signinAction';


const Signin= (props) => {
  return (
    <div>
<span>Already have an account?</span>
<br/>
<br/>
<TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/visit/auth/twitter"}
        onFailure={props.twitterAuthFailure} onSuccess={props.signInWithTwitter}
        requestTokenUrl={config.base_dir+"/api/twitter/auth/twitter/reverse"}  />
    </div>
  )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { 
   
    twitterAuthFailure,
    signInWithTwitter})(Signin)


