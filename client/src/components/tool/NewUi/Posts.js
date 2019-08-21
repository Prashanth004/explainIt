import React from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import { getAllReferral } from '../../../actions/referral'
import { Helmet } from "react-helmet";
import DisplatCreated from './diaplyissues/DisplayCreated';
import IssueDisplay from './diaplyissues/DisplayIssues';
import config from '../../../config/config';
// import { FiGrid, FiList } from "react-icons/fi";
import Activity from './Activies/indexActivity';
import Setting from './newNav/setting';
import CallNotification from './container/CallNotification';
import { stillAuthenicated } from '../../../actions/signinAction';
import { getAllActivities, addActivity } from '../../../actions/callAction'
import { openInbox, openCreated } from "../../../actions/navAction";
import { addNewAnswerProject,getProfileDetails  } from '../../../actions/profileAction';
import MobNav from './newNav/index'
import {  setVisitProfile } from "../../../actions/visitProfileAction";
import { initiateSocket,validateTwitterHandle } from '../../../actions/homeAction';
import socketIOClient from "socket.io-client";

class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeOfView: "list", testHandleStarted:false,
            handleValidated:false,
            gotAllActivity: false, reducedWidth: false, reducedLittleWidth: false
        };
        this.resize = this.resize.bind(this);
        this.changeViewToList = this.changeViewToList.bind(this);
        // this.initiateSocketLoc = this.initiateSocketLoc.bind(this);
        this.testHandle = this.testHandle.bind(this);
        this.initiateSocketLoc = this.initiateSocketLoc.bind(this);
    }
    // initiateSocketLoc() {
    //     this.props.initiateSocket();
    //     this.setState({ socketinitiated: true });
    // }

    testHandle(){
        this.setState({testHandleStarted:true});
        var arrayDeCons = (window.location.pathname).split('/');
        const twiHand = arrayDeCons[1].replace("@", "");
        if(twiHand === this.props.authTwitterHandle){
            this.setState({ isHome: true })
                            if(this.props.allprojects === null || this.props.gotAllActivities){
                                this.props.getAllActivities();
                                this.props.getProfileDetails(this.props.userId, config.SELF);
                            }
                            this.props.openInbox();
        }
        else{
            this.setState({ isHome: false })
                        this.props.getProfileDetails(this.props.profileid, config.VISIT_PROF);
                        this.props.setVisitProfile(twiHand);
                        localStorage.setItem("peerId", JSON.stringify(twiHand))
                        this.props.openCreated();
        }   
      
        this.setState({handleValidated:true}) 
    }
    resize() {
        this.setState({ reducedWidth: window.innerWidth <= 700 });
        this.setState({ reducedLittleWidth: window.innerWidth <= 1200 });
        if (window.innerWidth <= 700) {
            this.setState({ issuepercentage: "100%" });
        } else {
            this.setState({ issuepercentage: "59%" });
        }
    }
    changeViewToList() {
        if (this.state.typeOfView === "list") {
            this.setState({ typeOfView: "grid" })
        }
        else {
            this.setState({ typeOfView: "list" })
        }
    }
    componentWillUnmount() {
        window.removeEventListener('storage', this.reloadPage)
        window.removeEventListener("resize", this.resize());
    }
    componentWillMount() {
       
        this.props.stillAuthenicated()
        this.props.validateTwitterHandle(window.location.pathname.split('/')[1].replace('@',''))
    }


    reloadPage(event) {
        if (event.key === 'token') {
            window.location.reload();
        }
    }
    componentWillReceiveProps(nextProps){
        // const self = this;
        if(nextProps.socket){
            nextProps.socket.on(config.SAVED_NEW_PROJECT, data => {
                if (data.userId === this.props.userId) {
                  
                }
            })
            nextProps.socket.on(config.NEW_MESSAGE, data => {
                if (data.touser === (this.props.userId) || data.fromuser === (this.props.userId)) {
                    this.props.addActivity(data.data)
                }
            })
        }
        if(nextProps.donValidationHandle || nextProps.authAction){
            if(nextProps.donValidationHandle && !this.state.testHandleStarted && nextProps.authAction){
                this.testHandle()
            }
        }

    }
  
    initiateSocketLoc(){
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
        try{
          const socketloc = socketIOClient(config.base_dir, connectionOptions);
          socketloc.on('reconnect_attempt', () => {
            socketloc.io.opts.transports = ['websocket'];
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
        componentDidMount() {
          this.setState({ reducedWidth: window.innerWidth <= 700 });
          const {socket} = this.props;
          if( socket !==null){
              if(!socket.connected){
                this.initiateSocketLoc();
              }
          }else{
                this.initiateSocketLoc();
              
          }
        window.addEventListener("resize", this.resize.bind(this));
        if(this.props.donValidationHandle && !this.state.testHandleStarted && this.props.authAction){
            this.testHandle()
        }
        this.resize();
        if (this.props.socket !== null) {
            this.props.socket.on(config.SAVED_NEW_PROJECT, data => {
                if (data.userId === this.props.userId) {
                    this.props.getProfileDetails(this.props.userId, config.SELF)
                }
            })
            this.props.socket.on(config.NEW_MESSAGE, data => {
                if (data.touser === (this.props.userId) || data.fromuser === (this.props.userId)) {
                    //this.props.getAllActivities()
                    this.props.addActivity(data.data)
                }
            })
          
        }
    }
    render() {
       
        // if (this.props.socket === null && !this.state.socketinitiated)
        //     this.initiateSocketLoc();
        const issuepercentage = this.state.reducedWidth ? "100%" : "59%";
        const callNotificationDiv = (<CallNotification />)
        const nav = (this.state.reducedWidth) ? (<MobNav page={!this.state.isHome ? config.VISIT_PROFILE_PAGE : config.HOME_PAGE} />) : (<Navbar page={!this.state.isHome ? config.VISIT_PROFILE_PAGE : config.HOME_PAGE} />)


        const issuesCreated = (this.props.myissues !== null) ? (this.props.myissues) : ([])

        // const listGrid = (window.innerWidth >= 1000) ? (<div style={{ position: "fixed", top: "90px", right: "30px" }} >
        //     <span className="hint--top" aria-label="List View">
        //         <FiList onClick={this.changeViewToList} className="listView" />
        //     </span>
        //     <span className="hint--top" aria-label="Grid View">
        //         <FiGrid onClick={this.changeViewToList} className="gridView" />
        //     </span>
        // </div>) : (null);


        const participatedDiv = (this.props.participated || this.props.created) ? (
            (this.state.typeOfView === "list") ? (<div className="issueContainer" style={{ width: issuepercentage }} >
                <IssueDisplay home={config.HOME} />
            </div>) : (<div className="issueContainer" style={{ width: "80%" }} >

                <div className="closeBtnHolder">
                </div>
                <DisplatCreated home={config.HOME} issueArray={(this.props.participated) ? this.props.participatedIssues : issuesCreated} />
            </div>)) : (null)
        const feedDiv = (this.props.participated || this.props.created) ?
            (<div>
                {/* {listGrid} */}
                {participatedDiv}
            </div>) : (this.props.inbox ? (<div>
                <Activity userId={this.props.userId} />
            </div>) : (this.props.Setting ? (<Setting userId={this.props.userId} />) : (null)))


        return (this.props.authAction ? (this.state.handleValidated?(
            (this.props.isAauthenticated) ? (
                ((this.props.gotAllActivities || !this.state.isHome)&& this.props.donefetching) ? (
                    <div>
                        {nav}
                        <Helmet>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" />
                        </Helmet>
                        <div className="containerHome">
                            {callNotificationDiv}
                        </div>
    
                        {feedDiv}
                    </div>
                ) : (null)) :((this.props.donefetching) ? (
                    <div>
                        {nav}
                        <Helmet>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" />
                        </Helmet>
                        <div className="containerHome">
                            {callNotificationDiv}
                        </div>
    
                        {feedDiv}
                    </div>
                ) : (null)) 
           ):(null)
            
            ): (null))
    }
}
const mapStateToProps = state => ({
    myissues: state.profile.myIssues,
    participated: state.nav.openParticipated,
    inbox: state.nav.openInbox,
    authAction: state.auth.authAction,
    isAauthenticated: state.auth.isAuthenticated,
    home: state.nav.openHome,
    profileid: state.home.id,
    created: state.nav.openCreated,
    allprojects: state.profile.myIssues,
    participatedIssues: state.profile.participatedIssue,
    userId: state.auth.id,
    authTwitterHandle: state.auth.twitterHandle,
    Setting: state.nav.openSetting,
    gotAllActivities: state.call.gotAllActivities,
    socket: state.home.socket,
    donValidationHandle: state.home.donValidationHandle,
    isPresentInExplain: state.home.presentOnExplain,
    profilePresentOnTwitter: state.home.presentOnTwitter,
   donefetching:state.profile.donefetching,
    
})
export default connect(mapStateToProps, {
    openInbox, getAllActivities, openCreated,getProfileDetails , initiateSocket, addActivity, getAllReferral,
    addNewAnswerProject, stillAuthenicated, validateTwitterHandle, setVisitProfile
})(Posts)