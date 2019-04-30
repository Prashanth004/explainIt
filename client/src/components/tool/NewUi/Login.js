import React, { Component } from 'react'
import '../../css/NewSignin.css'
import TwitterLogin from 'react-twitter-auth';
import { Redirect} from 'react-router-dom';
import config from '../../../config/config';
import { signInWithGoogle, stillAuthenicated,twitterAuthFailure,signInWithTwitter } from '../../../actions/signinAction';
import PropType from 'prop-types';
import { connect } from 'react-redux';


class Login extends Component {
    constructor() {
        super();
        this.state={
            istwitterPressed:false
        }
        this.state = { isAuthenticated: false, user: null, token: '' };
        this.googleResponse = this.googleResponse.bind(this);
        this.githubResponse = this.githubResponse.bind(this);
        this.githubFailure = this.githubFailure.bind(this);
        this.twitterPressed = this.twitterPressed.bind(this)
    }
  
    handleGit(){
        var url = `https://github.com/login/oauth/authorize?client_id=${config.gitHubClientId}&scope=user&redirect_uri=${config.react_url_git}`
        window.open(url,'_self')
    }
    componentWillMount(){
        this.props.stillAuthenicated()
    }
    twitterPressed(){
       
        this.setState({
        istwitterPressed:true
        })
    }

    githubResponse(response){
    }
    githubFailure(response){
    }
    googleResponse(response) {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        this.props.signInWithGoogle(tokenBlob)
    }
   
    onFailed = (error) => {
        alert(error);
    };

    render() {
        let content = !this.props.isAuthenticated ?
            ((this.state.istwitterPressed && !this.props.twitterLoginFailed)?
            ( <div className="loginSection">
            <div className="Logininfo">
                <h4><b>Redirecting..</b></h4>
            </div>
            </div>):(<div className="ShapeImage">
                {/* <div className="ShapeImage">
                </div> */}
                <div className="loginSection">
                    <div className="Logininfo">
                        <h3>
                            <b>
                            Making visual explanations quick and easy 
                        </b>
                        </h3>
                        <br/>
                        <h5>
                            <b>
                              
                        </b>
                        </h5>
                        <br />
                            <div onClick={this.twitterPressed} className="buttonDiv">
                                <TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/auth/twitter"}
                                    onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
                                    requestTokenUrl={config.base_dir+"/api/twitter/auth/twitter/reverse"} />
                            </div>
                           
                        
                    </div>
                </div>
            </div>
            )): (<Redirect to={{ pathname: './emailvarify' }} />) 
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
    stillAuthenicated:PropType.func.isRequired,
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    authAction :state.auth.authAction,
    twitterLoginFailed:state.auth.twitterLoginFailed
})
export default connect(mapStateToProps, { signInWithGoogle, stillAuthenicated, twitterAuthFailure, signInWithTwitter})(Login)

