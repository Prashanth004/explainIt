import React, { Component } from 'react';
import axios from 'axios';
import config from '../../../../../config/config';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import '../activity.css';
import CallSuccess  from './CallSuccess';
import CallFail from './CallFailed';
import Message from './Message';
import AddActivity from '../addToContact'
import {addNewUser} from '../../../../../actions/storeUserAction'
import { changeReadStatus } from '../../../../../actions/messageAction'
import Explain from '../explainActivity'

class ActivityMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "",
            profilePic: null
        }
    }
    componentDidMount() {
        const {activity,userData} = this.props
        console.log(activity.unread)
        if(activity.unread === 1)
            this.props.changeReadStatus(activity.id)
        var token = JSON.parse(localStorage.getItem('token'))
        var newData = userData.filter(user=>user.key === activity.fromuser);
        if(newData.length ===0){
            axios({
                method: 'get',
                url: config.base_dir + "/api/users/id/" + activity.fromuser,
                headers: {
                    "Authorization": token,
                }
            }).then(res => {
                if (res.status === 200 || res.status === 304) {
                    if(res.data.data !== null){
                    this.setState({
                        userName: res.data.data.twitterhandle,
                        profilePic: res.data.data.profilepic
                    })
                    this.props.addNewUser(res.data.data)
                }
                else{
                    axios({
                        method: 'get',
                        url: config.base_dir + "/api/tweetactions/getuser/" + activity.touser,
                        headers: {
                            "Authorization": token,
                        }
                    }).then(res=>{
                        if(res.status === 200 || res.status === 304){
                            
                                this.setState({
                                    userName: res.data.data[0].twitterhandle,
                                    profilePic: res.data.data[0].profilepic
                                })
                        }
                    })
                    .catch(error=>{
                        console.log("error : ",error)
                    })
                }
                
                }
            })
        }
        else{
            this.setState({
                userName:newData[0].data.twitterhandle,
                profilePic: newData[0].data.profilepic
            })
        }
  
    }
  render() {
    const activitiesElements =(this.props.activity.activity===config.CALL_FAILED)?
    (<CallFail
        userData = {this.state}
        activity={this.props.activity}/>):
        ((this.props.activity.activity===config.CALL_SUCCESSFULL)?
        (<CallSuccess
             userData = {this.state}
             activity={this.props.activity} />):(
                 this.props.activity.activity === config.MESSAGE_ACTIVITY?(
                <Message 
                    userData = {this.state}
                    activity={this.props.activity}/>):(
                        this.props.activity.activity === config.ADD_NEW_CONTACT?
                        (<AddActivity  userData = {this.state}
                            direction="from"
                            activity={this.props.activity}/>):(
                        <Explain 
                        userData = {this.state}
                        direction="to"
                        activity={this.props.activity}/>)
                       
                    )))
    return (
        <div>
            {activitiesElements}
        </div>
      
    )
  }
}
ActivityMain.PropType = {
    changeReadStatus: PropType.func.isRequired,
    addNewUser:PropType.func.isRequired
};
const mapStateToProps = state => ({
    userData : state.userStore.userData

})
export default connect(mapStateToProps, {addNewUser, changeReadStatus })(ActivityMain)



