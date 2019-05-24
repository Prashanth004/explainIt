import React from 'react'
import LogoContainer from './logoContainer'
import './landing.css'
import Form from './form'
export default () => {
  return (
    <div className="righSection">
        <div className="onboardSection">
            <LogoContainer />
         <div className="onboardMessage">
            <h5>Alright then, tell us if you are interested and if we can send an email to you to test out our app</h5>
            <br/>
            <Form />
         </div>

        </div>
        
    
    </div>
  )
}
