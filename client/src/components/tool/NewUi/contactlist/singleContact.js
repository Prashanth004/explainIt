import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import config from '../../../../config/config'
// import PropType from 'prop-types';


class cntactCard extends Component {
    constructor(props){
        super(props)
        this.state={
            userName: ' ',
            profilePic: ' ',
        }
    }
    componentWillMount(){
        const {contactId,userData} = this.props;
        var token = JSON.parse(localStorage.getItem('token'))
        var newData = userData.filter(user=>user.key === contactId);
        // if(newData.length ===0){
        //     axios({
        //         method: 'get',
        //         url: config.base_dir + "/api/users/id/" + contactId,
        //         headers: {
        //             "Authorization": token,
        //         }
        //     }).then(res => {
        //         if (res.status === 200 || res.status === 304) {
    
        //             this.setState({
        //                 userName: res.data.data.twitterhandle,
        //                 profilePic: res.data.data.profilepic
        //             })
        //             this.props.addNewUser(res.data.data,userData)
        //         }
        //     })
        // }
    }
  render() {
    return (
      <div>
          {/* <div style={{width:"50px", height:"50px",borderRadius:"50%"}}>
              {/* <img src={}></img> */}
          {/* </div> */}
       {/* {this.props.contactId}  */}
      </div>
    )
  }
}

cntactCard.PropType = {
  
};
const mapStateToProps = state => ({
    userData : state.userStore.userData

})
export default connect(mapStateToProps, {})(cntactCard)



