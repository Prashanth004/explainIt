import React, { Component } from 'react'
import {signInWithGitHub} from '../actions/signinAction';
import { Redirect} from 'react-router-dom';
import PropType from 'prop-types';
import { connect } from 'react-redux';

class Git extends Component {
    constructor(props){
        super(props)
        this.state={
            message:null
        }
    
    }

    componentDidMount(){
        const code =(window.location.href).split("=")
        if(code[1]!==undefined  ||code[1]!==null){
        
            // const tokenBlob = new Blob([JSON.stringify({access_token:code[1]}, null, 2)], {type : 'application/json'});
            this.props.signInWithGitHub(code[1])
        }
        else{
            this.props.history.push('/newlogin')
        }
      
    }
  render() {
    let content = !!this.props.isAuthenticated ? (<Redirect to={{ pathname: './newhome' }} />) :(<div>

<h1>Please wait..</h1>
    </div>);


    return (
      <div>
          {content}
        
      </div>
    )
  }
}

Git.PropType = {
    signInWithGitHub: PropType.func.isRequired,
   
};
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})
export default connect(mapStateToProps, { signInWithGitHub})(Git)
