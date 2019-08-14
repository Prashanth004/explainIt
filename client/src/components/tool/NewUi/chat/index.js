import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import config from '../../../../config/config'
import { stillAuthenicated } from '../../../../actions/signinAction';
import ClientChat from './ChatInit'

class ChatMain extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: null };
    }
    componentWillMount() {
        this.props.stillAuthenicated();
        const socket = socketIOClient(config.base_dir);
        this.setState({ socket: socket });
    }

    render() {
        const { socket } = this.state;
        const { profileid } = this.props;
        return (socket !== undefined ? (
            <div style={{ width: "70%", margin: "auto", marginTop: "30px", borderStyle: "solid", borderRadius: "5px" }}>
                {/* <ClientChat socket={socket} profileid={profileid} /> */}
                <p style={{ float: "left" }}>Hi, Can I share screen with you?</p>
                <div style={{ displa: "grid", gridTemplateColumns: "30% 30% 30%", float: "right" }}>
                    <div style={{ margin: "5px", padding: "5px", borderStyle: "solid", borderRadius: "5px", borderWidth: "1px" }}><p> Yes, sure</p></div>
                    <div style={{ margin: "5px", padding: "5px", borderStyle: "solid", borderRadius: "5px", borderWidth: "1px" }}><p>Send me Recording please</p></div>
                    <div style={{ margin: "5px", padding: "5px", borderStyle: "solid", borderRadius: "5px", borderWidth: "1px" }}><p>Schedule(button which will lead to date picker)</p></div>
                </div>
            </div>
        ) : (null))
    }
}
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    profileid: state.auth.id,
})

export default connect(mapStateToProps, {
    stillAuthenicated
})(ChatMain)


