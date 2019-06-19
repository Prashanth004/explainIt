import React, { Component } from 'react'
import TwitterLogin from 'react-twitter-auth';
import { connect } from 'react-redux';
import config from '../../../config/config'
import { twitterAuthFailure,signInWithTwitter } from '../../../actions/signinAction';
import '../../css/ExplainpPage.css'
import PropType from 'prop-types';
import '../../css/ExplainpPage.css'
class ExplainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            twitterHandle:null
        }
        this.closeFunction = this.closeFunction.bind(this)
    }

    componentWillMount(){
        const twitterHandle = (window.location.href).split("/")[3]
        this.setState({
            twitterHandle:twitterHandle
        })
    }

    closeFunction(){
       
        this.props.handleCloseModal();
    }

   
    render() {
        if(this.props.isAuthenticated){
            this.closeFunction()
        }
     
      
        return(
                <div>
              
                <div className="requestLogin">
                <h3>You need to login to <b>Explain</b></h3><br/>
                <TwitterLogin className="buttonDark twitterButton" loginUrl={config.base_dir+"/api/twitter/visit/auth/twitter"}
        onFailure={this.props.twitterAuthFailure} onSuccess={this.props.signInWithTwitter}
        requestTokenUrl={config.base_dir+"/api/twitter/visit/auth/twitter/reverse/"+this.state.twitterHandle} />
        </div>
        </div>
            )
        
    }
}

ExplainPage.PropType = {
  
    saveExtensionDetails: PropType.func.isRequired,
    twitterAuthFailure:PropType.func.isRequired,
    signInWithTwitter:PropType.func.isRequired


};
const mapStateToProps = state => ({
   

   
    isAuthenticated: state.auth.isAuthenticated,
  
   
})

export default connect(mapStateToProps, { 
   
    twitterAuthFailure,
    signInWithTwitter})(ExplainPage)


