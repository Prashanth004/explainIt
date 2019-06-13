import React, { Component } from 'react'
import '../../css/NewSignin.css'
import TwitterLogin from 'react-twitter-auth';
import { Redirect} from 'react-router-dom';
import config from '../../../config/config';
import {varifyActivation} from '../../../actions/emailAction'
import {getProfileByTwitterHandle} from '../../../actions/visitProfileAction'
import {getRecpientId} from '../../../actions/twitterApiAction'
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
        var { twitterhandle } = this.props.match.params
        if(twitterhandle.includes("@"))
        {
            this.props.getProfileByTwitterHandle(twitterhandle.replace("@",""));
            this.props.getRecpientId(twitterhandle.replace("@",""),null);
            this.props.varifyActivation(twitterhandle.replace("@",""))
        }
        else{
            this.props.getProfileByTwitterHandle(twitterhandle);
            this.props.getRecpientId(twitterhandle,null);
            this.props.varifyActivation(twitterhandle)
        }
        this.props.stillAuthenicated()
       
        // this.props.getProfileByTwitterHandle('cprashnth004');
        // this.props.getRecpientId('cprashnth004');


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
        let content = this.props.doneFetching?(
            (this.props.profilePresent)?(
                                this.props.isPresent?(
                                    this.props.isActivated?(

                                    !this.props.isAuthenticated ?
                                    ((this.state.istwitterPressed && !this.props.twitterLoginFailed)?
                                    ( <div className="loginSection">
                                    <div className="Logininfo">
                                        <h4><b>Redirecting..</b></h4>
                                    </div>
                                    </div>):(
                                    <div className="ShapeImage">
                                    {/* <div className="ShapeImage">
                                    </div> */}
                                    <div className="loginSection">
                                        <div className="Logininfo">
                                        <h4> <b>Hi {this.props.visitUser}. Good to see you again!!</b></h4>
                                        <br/>
    
                                            <br/>
                                            <br />
                                                <div onClick={this.twitterPressed} className="buttonDiv">
                                                    <TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/auth/twitter"}
                                                        onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
                                                        requestTokenUrl={config.base_dir+"/api/twitter/auth/twitter/reverse"} />
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                     )) : (<Redirect to={{ pathname: '../application' }} />) )
                                     :( <div className="ShapeImage">
                                       
                                     <div className="loginSection">
                                         <div className="Logininfo">
                                         <h4><b> Hi {this.props.name},Good to see you again!!</b></h4>
                                         <br/>
                                         <h4>We appreciate your patience!</h4>
                                            <br/>
                                            <h4>We'l get back to you once we are ready</h4>
                                         </div>
                                         </div>
                                         </div>
                                     )
                                    ):(
                                        <div className="ShapeImage">
                                       
                                        <div className="loginSection">
                                            <div className="Logininfo">
                                            <h4> Hi {this.props.name},Please visit our home page to get started!!</h4>
                                            <br/>
                                            <h4> <a href={config.react_url}>Click Here</a></h4>

                                            </div>
                                            </div>
                                            </div>
                                    )):(
                                        <div className="loginSection">
                                    <div className="Logininfo">
                                    <h4> Not valid Twitter handle. Please try again</h4>
                                    <br/>
                                    </div>
                                    </div>
                                    )
                                    ):(<div className="loginSection">
                                    <div className="Logininfo">
                                    <h4> Getting you ready. please wait</h4>
                                    <br/>
                                    </div>
                                    </div>)


          
         
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
    varifyActivation:PropType.func.isRequired,
    getRecpientId:PropType.func.isRequired,
    getProfileByTwitterHandle:PropType.func.isRequired,
    
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    authAction :state.auth.authAction,
    twitterLoginFailed:state.auth.twitterLoginFailed,
    visitUser:state.visitProfile.userName,
    isPresent:state.visitProfile.isPresent,
    profilePresent:state.twitterApi.profilePresent,
    doneFetching:state.twitterApi.doneFetching,
    name:state.twitterApi.name,
    isActivated:state.email.isActivated
})
export default connect(mapStateToProps, { varifyActivation,getRecpientId,getProfileByTwitterHandle,signInWithGoogle, stillAuthenicated, twitterAuthFailure, signInWithTwitter})(Login)

