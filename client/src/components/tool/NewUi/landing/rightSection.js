import React from 'react'
import LogoContainer from './logoContainer'
import './landing.css'
import Signin from './signin'
import Form from './form'
export default () => {
  return (
    <div className="righSectionLand">
        <div className="onboardSection">
            <LogoContainer />
         <div className="onboardMessage">
            <h6>Alright then, tell us if you are interested and if we can notify you to test out our app
</h6>
            <br/>
            <Form />
            <br />
           <Signin />
         </div>

        </div>
        
    
    </div>
  )
}
