import React, { Component } from 'react'

import GoogleLogin from 'react-google-login'
import config from '../config/config'

export default class testGoogle extends Component {
   
   
  render() {
    const googleResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
          
        };
        fetch('http://localhost:9000/users/google', options).then(r => {
          
            r.json().then(user => {
                if (user.token) {
                }
            });
        })
    };
    const responseGoogle = (response) => {
      }
    return (
      <div>
       
  {/* <GoogleLogin
    clientId={config.googleClientId}
    render={renderProps => (
      <button onClick={renderProps.onClick}>Google</button>
    )}
    buttonText="Login"
    onSuccess={googleResponse}
    onFailure={responseGoogle}
  /> */}
  <GoogleLogin
    clientId={config.googleClientId}
    buttonText="Login"
    onSuccess={googleResponse}
    onFailure={responseGoogle}
  />
      </div>
    )
  }
}
