import React, { Component } from 'react'
import { connect } from 'react-redux';
import Navbar from './Navbar'
import PropType from 'prop-types';
import {getAllMessages} from '../../../actions/messageAction'
import '../../css/inbox.css'
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
  render() {
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
        var allMessageEle =null
      }
     
    
    return (
      <div className="mainBodyContainer">
          <Navbar />
          <div className="inboxContainer">
          <div className="inboxText">
          <h1 >Inbox</h1>
          </div>
              
              <div>
                  {allMessageEle}
              </div>
          </div>
        
      </div>
    )
  }
}

Inbox.PropType = {
    getAllMessages:PropType.func.isRequired
   
  };
  const mapStateToProps = state => ({
    userId: state.auth.id,
    allMessage:state.message.allMessage
  
  })
  export default connect(mapStateToProps, { getAllMessages })(Inbox)
