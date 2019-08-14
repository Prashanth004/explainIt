import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import '../../css/emailvarify.css';
import OTP from 'otp-client';
import ConfirmEmail from './confrimEmail'
import config from '../../../config/config';
import './landing/landing.css'
import { stillAuthenicated, signout } from '../../../actions/signinAction';
import {varifyEmail,activateProfile,resendOtp, sendOtp} from '../../../actions/emailAction'

class EmailVarify extends Component {
  constructor(props){
    super(props)
    this.state={
        submitPressed:false,
        emailFlieldValue:null,
        enteredOtp:null,
        taken:null,
        otpVarified:false,
        optIncorrect:true,
        valdatingMessage:false,
        invalidOTP:false,
        resendClick:false,
        confirmedPressed:false
    }
    this.pressSubmit = this.pressSubmit.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.changeOtpValue = this.changeOtpValue.bind(this);
    this.varifyOtpValue = this.varifyOtpValue.bind(this);
    this.resend = this.resend.bind(this);
    this.editEmail = this.editEmail.bind(this);
    this.confirmedEmail = this.confirmedEmail.bind(this);
  }
 
 onEmailChange(e){
     this.setState({
        emailFlieldValue:e.target.value
     })
 }
 changeOtpValue(e){
    this.setState({
        enteredOtp:e.target.value,
        valdatingMessage:false,
        invalidOTP:false
    })
 } 
 tryAgain(){
     this.setState({submitPressed:false})
 }





 varifyOtpValue(){
     this.setState({
        valdatingMessage:true
     })
   
     if(this.state.token === this.state.enteredOtp)
     {
         this.setState({
             otpVarified : true,
             optIncorrect:false,
             valdatingMessage:false})
             this.props.activateProfile(this.state.emailFlieldValue)
     }
     else{
        this.setState({
            optIncorrect : true,
            invalidOTP:true,
            valdatingMessage:false,
            otpVarified:false})            
     }
 }
 resend(){
     this.setState({
         resendClick:true
     })
     this.props.resendOtp(this.state.emailFlieldValue)
 }
  pressSubmit=()=>{this.setState({submitPressed:true})}

  confirmedEmail=()=>{
    const secret = config.OTP_SECRET
    const options = {
        algorithm: "sha256",
        digits: 6,
        period: 50
      }
    const otp = new OTP(secret,options)
    const token = otp.getToken()
    this.props.sendOtp(this.state.emailFlieldValue,token )
      this.setState({
          confirmedPressed:true,
          token:token
      })
  }

  editEmail=()=>{this.setState({submitPressed:false})}

  render() {
    var otpAction =null;
    var validateOtp = (this.state.valdatingMessage)?(
<p>validating Passcode</p>
    ):(null)
    var invalidOTP = (this.state.invalidOTP)?(
        <p>incorrect passcode</p>
    ):(null)
    if(this.state.resendClick!==true){
        otpAction=(this.state.confirmedPressed)?(
            (this.props.otpSent)?(
                <div>
                    <p>Passcode is sent to {this.state.emailFlieldValue}</p>
          
                    <span style={{fontSize:"12px"}}>check spam/update section too</span>
                    <h5>Enter passcode to verify</h5>
                    <br />
                    <input type="text" className="emailInput OTP" onChange={this.changeOtpValue}></input>
                    <button className="buttonDark" onClick={this.varifyOtpValue}>Submit</button>
                    <br/>
                    <br/>
                    <button className="buttonLight" onClick={this.resend}>Resend</button>
                </div>
            ):(!this.props.failedOtp?(<h4>Sending passcode to your mail</h4>):
                (<div><h4>Email sent Failed</h4>
                    <button className="buttonLight" onClick={this.tryAgain}>Try again</button>
                    </div>)
            )
        ):(this.state.submitPressed)?(
            <ConfirmEmail 
            email={this.state.emailFlieldValue}
            confirmedEmail={this.confirmedEmail}
            editEmail={this.editEmail}/>
        ):(
            <div>
                <h5>Enter an email id for us to contact you and update you when needed </h5>
                <br/>
                <input type="text" className="emailInput" onChange={this.onEmailChange}></input>
                <button className="buttonLight" onClick={this.pressSubmit}>Submit</button>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <button className = "buttonDark" onClick={this.props.signout}>Logout</button>
            </div>)
    }
    else{
        otpAction = (this.props.reSentOtp)?(
            <div>
                <p>passcode is sent to {this.state.emailFlieldValue}</p>
                <h5>Enter passcode to verify</h5>
                <br />
                <input type="text" className="emailInput OTP" onChange={this.changeOtpValue}></input>
                <button className="buttonDark" onClick={this.varifyOtpValue}>Submit</button>
                <br/>
                <br/>
                <br/>
            
            </div>
        ):(
            <h4>Resending passcode to your mail</h4>
        )

    }

//     isAuthenticated: state.auth.isAuthenticated,
//     authAction: state.auth.authAction,
// })

    return (<div className="emailVarify">
        <div className="emailboxCotainer">
        <div className="logoEmail">
            <span>
              <img alt="logo" onClick={this.logout} height="100%" width="100%" src={require('../../images/logo5.png')} />
            </span>
        </div>
        <br/>
        <br/>
       {otpAction}  
       {validateOtp}  
       {invalidOTP}  
        </div>
      </div>)
  }
}
EmailVarify.PropType = {
    varifyActivation:PropType.func.isRequired,
    sendOtp:PropType.func.isRequired,
    activateProfile:PropType.func.isRequired,
    resendOtp:PropType.func.isRequired
   };

const mapStateToProps = state => ({
    doneVarification : state.email.doneVarification,
    isVarified:state.email.isVarified,
    otpSent:state.email.sentOtp,
    failedOtp:state.email.failedOtp,
    profileActivated:state.email.profileActivated,
    reSentOtp:state.email.reSentOtp,
    reSendOtpFailed:state.email.reSendOtpFailed,
    isAuthenticated: state.auth.isAuthenticated,
    authAction: state.auth.authAction,
})

export default connect(mapStateToProps, { 
    varifyEmail,sendOtp,activateProfile,
    resendOtp,signout,stillAuthenicated
})(EmailVarify)
