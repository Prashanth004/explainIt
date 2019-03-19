import React, { Component } from 'react'
import { connect } from 'react-redux';
import Navbar from './Navbar'
import PropType from 'prop-types';
import {getAllMessages} from '../../../actions/messageAction'
import {stillAuthenicated} from '../../../actions/signinAction'
import '../../css/inbox.css'
import Login from './Login'
class Inbox extends Component {

    constructor(props){
        super(props)
        this.state={
            userId:this.props.userId
        }
    }
    componentDidMount(){
            console.log(this.props.match.params.userid)
            this.props.getAllMessages(this.props.match.params.userid)
      
       
    }
    componentWillMount(){
        this.props.stillAuthenicated()
    }
  render() {
      console.log("this.props.allMessage : ",this.props.allMessage)
      if(this.props.allMessage!==null){
        var allMessageEle = this.props.allMessage.map(message=>(
            <div className="messageElementDiv">
                <div>
                    <div className="profileImageInbox">
                        <img className="profileImageElementInbox"src={message.profilepic}/>
                    </div>
                   
                </div>
                <div>
                <p className="timeDate">{message.time}</p>

                    <p><b>
                        {message.username}
                        </b>
                    </p>
                    <p>
                    <a href={message.link}>{message.link}</a>
                    </p>
                    
                </div>
               
            </div>
        ))
      }
      else{
        var allMessageEle =(<div style={{textAlign:"center", marginTop:"20px"}}>
            <h4>Empty</h4>
        </div>)
      }
     
      return (this.props.authAction) ? ((!this.props.isAauthenticated) ? (<Login />) : (
        <div className="mainBodyContainer">
    <Navbar />
    <div className="inboxContainer">
    <div className="inboxText">
    <h1>Inbox</h1>
    </div>
        
        <div>
            {allMessageEle}
        </div>
    </div>
  
</div>
        )) : (null)
  }
}

Inbox.PropType = {
    getAllMessages:PropType.func.isRequired,
    stillAuthenicated:PropType.func.isRequired,
   
   
  };
  const mapStateToProps = state => ({
    userId: state.auth.id,
    allMessage:state.message.allMessage,
    isAauthenticated: state.auth.isAuthenticated,
    authAction: state.auth.authAction,
  
  })
  export default connect(mapStateToProps, {stillAuthenicated, getAllMessages })(Inbox)