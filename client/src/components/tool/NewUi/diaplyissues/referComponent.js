import React, { Component } from 'react'
import axios from 'axios';
import config from '../../../../config/config';
import { connect } from 'react-redux';
import {addNewUser} from '../../../../actions/storeUserAction'

class referralComp extends Component {
    constructor(props){
        super(props);
        this.state={
            twitterHandle:null,
            profilePic:null}
    }
    componentWillMount(){
        const {referralid,userData} = this.props
        var token = JSON.parse(localStorage.getItem('token'));
        var newData = null;
        
        axios({
            method: 'get',
            url: config.base_dir + '/api/referral/'+referralid,
            headers: {
                "Authorization": token,
            }
        }).then(response=>{
            console.log("response.data.data", response.data.data)
            newData = userData.filter(user=>user.key === response.data.data.referrer);
            if(newData.length ===0){
                axios({
                    method: 'get',
                    url: config.base_dir + "/api/users/id/" +  response.data.data.referrer,
                    headers: {
                        "Authorization": token,
                    }
                }).then(res => {
                    if (res.status === 200 || res.status === 304) {
        
                        this.setState({
                            twitterHandle: res.data.data.twitterhandle,
                            profilePic: res.data.data.profilepic
                        })
                        this.props.addNewUser(res.data.data,userData)
                    }
                })
            }
            else{
                this.setState({
                    twitterHandle:newData[0].data.twitterhandle,
                    profilePic: newData[0].data.profilepic
                })
            }
      
            // this.props.addNewUser(res.data.data,userData)
      })
      .catch(error =>{
          console.log("error : ",error)
      })
    }
  render() {
    return (
      <div>
        <span><b>referred by <a href={config.react_url+'/@'+this.state.twitterHandle}>@{this.state.twitterHandle}</a></b></span>
      </div>
    )
  }
}
const mapStateToProps = state => ({
    userData : state.userStore.userData
})
export default connect(mapStateToProps, {addNewUser })(referralComp)


