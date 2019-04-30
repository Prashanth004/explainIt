import React, { Component } from 'react'
import { connect } from 'react-redux';
import InboxMessages from './InboxMessages'
import PropType from 'prop-types';
import axios from 'axios';
import config from '../../../config/config'
import {getAllMessages} from '../../../actions/messageAction'
import {stillAuthenicated} from '../../../actions/signinAction'
import '../../css/inbox.css'
import Login from './Login'
class Inbox extends Component {

    constructor(props){
        super(props)
        this.state={
            userId:this.props.userId,
            isFiltered:false,
            filteredInbox:[]
        }
        this.filterInbox = this.filterInbox.bind(this)
    }
    filterInbox(){
        this.setState({
            isFiltered:true
        })
        var token = JSON.parse(localStorage.getItem('token'))
        var filteredInbox = []
        var issueId= null
        this.props.allMessage.forEach(message => {
            issueId = message.link.split('/')[4];
            axios({
                    method:'get',
                    url:config.base_dir+"/api/message/checkreplyinfo/"+issueId,
                    headers: {
                        "Authorization": token,
                    }
            
                }).then((response)=>{
                    if(response.status === 200 || response.status === 304){
                        if(response.data.success ===0){
                            filteredInbox.push(message)  
                        }
                        this.setState({
                            filteredInbox:filteredInbox
                        })
                    }
                })
                .catch(err=>{
                    console.log("errror : ",err)
                })
          


        });
    }
  
    componentWillMount(){
        
    }
  render() {
      var allMessageEle = null;
      if(this.props.allMessage!==null && !this.state.isFiltered){
            this.filterInbox()
      }
      if(this.state.filteredInbox!==null ){
          if(this.state.filteredInbox.length>0){
            var revallMessage = this.state.filteredInbox.reverse()
            allMessageEle = revallMessage.map(message=>(
                
                   <InboxMessages key = {message.id}message={message} />
                   
            ))
          }
          else{
            allMessageEle =(<div style={{textAlign:"center", marginTop:"20px"}}>
                <h4>You dont have any recorded messages yet</h4>
                <br/>
    
                <h6>When you respond to a recording, it automatically gets into participated list</h6>
            </div>)
          }
        
      }
      else{
        allMessageEle =(<div style={{textAlign:"center", marginTop:"20px"}}>
            <h4>You dont have any recorded messages yet</h4>
            <br/>

            <h6>When you respond to a recording, it automatically gets into participated list</h6>
        </div>)
      }
     
      return (this.props.authAction) ? ((!this.props.isAauthenticated) ? (<Login />) : (
        <div className="mainBodyContainer">
    {/* <Navbar /> */}
    <div className="inboxContainer">
    <div className="inboxText">
   
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
    email :state.auth.email,
    allMessage:state.message.allMessage,
    isAauthenticated: state.auth.isAuthenticated,
    authAction: state.auth.authAction,
  
  })
  export default connect(mapStateToProps, {stillAuthenicated, getAllMessages })(Inbox)
