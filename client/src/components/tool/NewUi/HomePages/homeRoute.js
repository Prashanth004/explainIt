import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openHome } from "../../../../actions/navAction";
import { initiateSocket,validateTwitterHandle } from '../../../../actions/homeAction';
import { stillAuthenicated } from '../../../../actions/signinAction';
import ProfileNotOnExplain from '../ProfileNotOnTwitter/ProfileNotOnExplain';
import config from '../../../../config/config';
import PageNotFount from '../NoMatch';
import socketIOClient from "socket.io-client";
import Home from './Home';
import VisitHome from './connectProfile';

class HomeRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.openHome();
        this.props.stillAuthenicated();
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({ currentAtionStatus: currentAtionStatus })
        const twiHand = this.props.match.params.encrTwitterHandle.replace("@", "");
        this.props.validateTwitterHandle(twiHand);
        localStorage.setItem("peerId", JSON.stringify(twiHand))
    }
    componentDidMount(){
        const {socket} = this.props;
        const self = this;
        var connectionOptions =  {
            "force new connection" : true,
            "reconnection": true,
            "reconnectionDelay": 2000,                  //starts with 2 secs delay, then 4, 6, 8, until 60 where it stays forever until it reconnects
            "reconnectionDelayMax" : 60000,             //1 minute maximum delay between connections
            "reconnectionAttempts": "Infinity",         //to prevent dead clients, having the user to having to manually reconnect after a server restart.
            "timeout" : 10000,                           //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]                //forces the transport to be only websocket. Server needs to be setup as well/
        }
        if( socket !==null){
            if(!socket.connected){
                try{
                    const socketloc = socketIOClient(config.base_dir, connectionOptions);
                    socketloc.on('reconnect_attempt', () => {
                        socket.io.opts.transports = ['websocket'];
                    });
                    socketloc.on('connect_failed', function () {
                        console.log("connection failed : ")
                    })
                    socketloc.on('error', function (err) {
                        console.log("socket error : ", err)
                    });
                    socketloc.on('connect_timeout', function (err) {
                        console.log("socket onnection_timeout : ", err)
                    });
                    socketloc.on("disconnect", () => {
                        console.log("socket disconnected")
                    })
                    socketloc.io.on("connect_error", () => {
                        console.log("connection_error")
                    })
                    self.props.initiateSocket(socketloc)
                }
                catch(error){
                    console.log("error : ",error)
                }
               
              
            }
        }else{
            const socketloc = socketIOClient(config.base_dir);
            this.props.initiateSocket(socketloc)
        }
    }
    render() {
        const twiHand = this.props.match.params.encrTwitterHandle.replace("@", "")
        return (this.props.authAction && !!this.props.donValidationHandle) ?
            (this.props.isPresentInExplain ? ((!this.props.isAauthenticated) ? (
                (this.props.match.params.encrTwitterHandle !== null) ? (
                    (this.props.authTwitterHandle === this.props.match.params.encrTwitterHandle.replace("@", "")) ?
                        (<Home />) : (<VisitHome twiHand={twiHand}/>)) : (<Home />)) : (<VisitHome />)) : ((this.props.profilePresentOnTwitter) ? (
                            <ProfileNotOnExplain
                                isVisitProfile={true}
                                twitterhandle={this.props.match.params.encrTwitterHandle}
                                source={config.VISIT_PROFILE_PAGE} />
                        ) : (<PageNotFount />))
            ) : (null)
    }
}
const mapStateToProps = state => ({
    authAction: state.auth.authAction,
    donValidationHandle: state.home.donValidationHandle,
    isPresentInExplain: state.home.presentOnExplain,
    authTwitterHandle: state.auth.twitterHandle,
    profilePresentOnTwitter: state.home.presentOnTwitter,
    socket : state.home.socket

})
export default connect(mapStateToProps, { openHome, initiateSocket, validateTwitterHandle, stillAuthenicated })(HomeRoute)

