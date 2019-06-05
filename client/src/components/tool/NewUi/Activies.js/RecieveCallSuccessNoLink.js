
import axios from 'axios';
import config from '../../../../config/config';
import React, { Component } from 'react';
import './activity.css';


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
        var timetaken = this.props.activity.duration
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
                        <p>You were in call with <b>@{this.state.userName}</b> for the topic <b>{this.props.activity.subject}</b> for <b>{Math.floor(timetaken)} minutes and
             {Math.floor((timetaken - Math.floor(timetaken)) * 60)} seconds</b>. Call not saved</p>

                    </div>
                </div>

            </div>
        )
    }
}


