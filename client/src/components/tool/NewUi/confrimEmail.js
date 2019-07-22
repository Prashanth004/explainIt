import React, { Component } from 'react'
import axios from 'axios';
import config from '../../../config/config'

export default class componentName extends Component {

  constructor(props){
    super(props)
    this.state={
      startedValidating:false,
      doneValidating:false,
      invalidEmail:false,
      emailAlreadyInUe:false,
      validEmail:false,
      postedValid:false
    }
    this.validateEmail = this.validateEmail.bind(this);
    this.postValidEmail = this.postValidEmail.bind(this);
  }

  postValidEmail(){
    this.setState({
      postedValid:true
    })
    this.props.confirmedEmail()
  }
  validateEmail(){
    const {email} = this.props;
    this.setState({startedValidating:true});
    var re  = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
      var OK = re.exec(email);  
       if(!email.includes("@") || !email.includes(".") )
    this.setState({
      invalidEmail:true,
      doneValidating:true
    })
    else{
      if( email.split('@')[1].length === 0 || email.split('@')[0].length===0 || email.split('@')[1].length=== 0)
      this.setState({
        invalidEmail:true,
        doneValidating:true
      })
      else{
        if (!OK) 
        this.setState({
          invalidEmail:true,
          doneValidating:true
        })
        else{
        axios.get(config.base_dir+'/api/users/email/'+email)
        .then(response=>{
          if((response.status ===200 || response.status === 304)){
            if(response.data.success ===1){
              this.setState({
                doneValidating:true,
                emailAlreadyInUe:true
                })}
                else{
                  this.setState({
                          doneValidating:true,
                          validEmail:true
                        })
                // axios.get("http://apilayer.net/api/check?access_key="+config.EXMAIL_VALIDATE_TOKEN+"&email="+email+"&smtp=1&format=1")
                // .then((response)=>{
                //   console.log("response : ",response)
                //   if(!response.data.smtp_check){
                //     this.setState({
                //       invalidEmail:true,
                //       doneValidating:true
                //     })
                //   }
                //   else{
                //     this.setState({
                //       doneValidating:true,
                //       validEmail:true
                //     })
                //   }
                // })
            }
          }
        })
      }

      }
 
    }
  }
  render() {
    
    const {email,editEmail } = this.props;
    const {invalidEmail,emailAlreadyInUe,validEmail,startedValidating,doneValidating} = this.state;

    if(!this.state.postedValid && validEmail && doneValidating)
          this.postValidEmail()
    const validatingMessage=(startedValidating && !doneValidating)?("validating you email Please wait"):null;
    const VAlidationActionButtons = (!doneValidating)?(<div>
      <button className="buttonLight" onClick={editEmail}>No</button>
      <button className="buttonLight" onClick={this.validateEmail}>Yes</button>
    </div>):(invalidEmail)?(
      
      <div>
        <p>Invalid Email id. Please try again</p>
        <button className="buttonLight" onClick={editEmail}>Edit</button>
      </div>
    ):((emailAlreadyInUe)?(
      <div>
         <p>Email id already in use. Try different one.</p>
        <button className="buttonLight" onClick={editEmail}>Edit</button>
      </div>
    ):((validEmail)?(<div>
      <p>Validated!!</p>
    </div>):(null))
      
    )
    return (
      <div>
        <h5>Is this your email id?</h5>
        <p>{email}</p>
       {VAlidationActionButtons}
        {validatingMessage}
      </div>
    )
  }
}




