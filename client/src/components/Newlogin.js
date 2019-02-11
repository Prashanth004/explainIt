import React, { Component } from 'react'
import './css/NewSignin.css'
import TwitterLogin from 'react-twitter-auth';
import { Redirect, Link } from 'react-router-dom';
import config from '../config/config';
import { signInWithGoogle, stillAuthenicated,twitterAuthFailure,signInWithTwitter } from '../actions/signinAction';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login'

class Login extends Component {
    constructor() {
        super();
        this.state = { isAuthenticated: false, user: null, token: '' };
        this.googleResponse = this.googleResponse.bind(this)
    }
    
    componentWillMount() {
        this.props.stillAuthenicated()
    }

    googleResponse(response) {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        this.props.signInWithGoogle(tokenBlob)
    }
   
    onFailed = (error) => {
        alert(error);
    };

    render() {
        let content = !!this.props.isAuthenticated ? (<Redirect to={{ pathname: './newhome' }} />) :
            (<div className="loginContain">
                <div className="ShapeImage">
                </div>
                <div className="loginSection">
                    <div className="Logininfo">
                        <h3>
                            <b>
                                Find the right approach to the question you have
                        </b>
                        </h3>
                        <br />
                        <h5>
                            <b>
                                Login with
                        </b>
                        </h5>
                        <br />
                        <div className="loginButton">
                            <div className="buttonDiv">
                                <GoogleLogin
                                    clientId={config.googleClientId}
                                    render={renderProps => (
                                        <button className="actualButton2"  onClick={renderProps.onClick}>Google</button>
                                    )}
                                    buttonText="Login"
                                    onSuccess={this.googleResponse}
                                    onFailure={this.responseGoogle}
                                />                       
                             </div>
                            <div className="buttonDiv">
                                <TwitterLogin className="actualButton2" loginUrl="http://localhost:9000/twitter/auth/twitter"
                                    onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
                                    requestTokenUrl="http://localhost:9000/twitter/auth/twitter/reverse" />
                            </div>
                            <div className="buttonDiv">
                                <button className="actualButton2">Github</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        return (
            <div>
                {content}
            </div>
        )
    }
}


Login.PropType = {
    signInWithGoogle: PropType.func.isRequired,
    twitterAuthFailure:PropType.func.isRequired,
    signInWithTwitter:PropType.func.isRequired,
    stillAuthenicated:PropType.func.isRequired
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})
export default connect(mapStateToProps, { signInWithGoogle, stillAuthenicated, twitterAuthFailure, signInWithTwitter})(Login)

