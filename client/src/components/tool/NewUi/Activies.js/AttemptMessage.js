
import axios from 'axios';
import config from '../../../../config/config';
import React, { Component } from 'react';
import './activity.css';
import CopyToClipboard from '../../CopytoClipboard'


export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: "",
            profilePic: null
        }
    }
    componentWillMount() {
        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method: 'get',
            url: config.base_dir + "/api/users/id/" + this.props.activity.touser,
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
        var timetaken = this.props.activity.duration
        var date = this.props.activity.date.slice(5, 7)
        return (
            <div className="activityContentWithDate">
                <div className="date">
                    <span>{this.props.activity.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span className="year">{this.props.activity.date.slice(0, 4)}</span>
                </div>
                <div className="activityContent">

                    <div>
                        <img className="activityImage" src={this.state.profilePic} alt="Profilepic"></img>
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <p>You have sent a recorded message to <b>@{this.state.userName}</b> on the topic <b>{this.props.activity.subject}</b></p>
                        <span>Link to access the recorded message:</span>
                        <CopyToClipboard sharablelink={this.props.activity.link} />
                    </div>
                </div>
            </div>
        )
    }
}


