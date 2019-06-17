
import axios from 'axios';
import config from '../../../../../config/config';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import '../activity.css';
import { changeReadStatus } from '../../../../../actions/messageAction';
import ImageContainer from '../imageContainer'


class RecievedMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "",
            profilePic: null
        }
    }
    componentWillMount() {
        
        this.props.changeReadStatus(this.props.activity.id)
        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method: 'get',
            url: config.base_dir + "/api/users/id/" + this.props.activity.fromuser,
            headers: {
                "Authorization": token,
            }
        }).then(res => {
            if (res.status === 200 || res.status === 304) {

                this.setState({
                    userName: res.data.data.twitterhandle,
                    profilePic: res.data.data.profilepic
                })
            }
        })
    }
    render() {
        var date = this.props.activity.date.slice(5, 7)
        return (
            <div className="activityContentWithDate">
                {/* <div className="date">
                    <span>{this.props.activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{this.props.activity.date.slice(0, 4)}</span>
                </div> */}
                <div className="activityContent">
                <span className="dateNew Notify">{this.props.activity.date.slice(8, 10)}  {config.monthPicker[date]}, {this.props.activity.date.slice(0, 4)}</span>

                    <div style={{ textAlign: "left" }}>
                        <p><ImageContainer name={this.state.userName} imgsrc={this.state.profilePic}/> sent a recorded message to you  on the topic <a href={this.props.activity.link}><b>{this.props.activity.subject}</b></a></p>
                     
                    </div>

                </div>
            </div>
        )
    }
}
RecievedMessage.PropType = {
    changeReadStatus: PropType.func.isRequired
};
const mapStateToProps = state => ({


})
export default connect(mapStateToProps, { changeReadStatus })(RecievedMessage)






