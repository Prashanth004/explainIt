import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";
import config from '../../../../config/config'
import { stillAuthenicated} from '../../../../actions/signinAction';
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
        const {socket} = this.state;
        const {profileid} = this.props;
         return (socket!==undefined?(
            <div>
                <ClientChat socket={socket} profileid={profileid} />
            </div>
        ):(null))
    }
}
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    profileid : state.auth.id,
})

export default connect(mapStateToProps, {
    stillAuthenicated
})(ChatMain)


