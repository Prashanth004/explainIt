import React, { Component } from 'react';
import { connect } from 'react-redux';
import { openHome } from "../../../../actions/navAction";
import { initiateSocket,validateTwitterHandle } from '../../../../actions/homeAction';
import { stillAuthenicated } from '../../../../actions/signinAction';
import ProfileNotOnExplain from '../ProfileNotOnTwitter/ProfileNotOnExplain';
import config from '../../../../config/config';
import PageNotFount from '../NoMatch';
import Home from './Home';
import VisitHome from './connectProfile';

class HomeRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this.props.openHome();
        this.props.initiateSocket()
        this.props.stillAuthenicated();
        const currentAtionStatus = JSON.parse(localStorage.getItem('currentAction'));
        this.setState({ currentAtionStatus: currentAtionStatus })
        const twiHand = this.props.match.params.encrTwitterHandle.replace("@", "");
        this.props.validateTwitterHandle(twiHand);
        localStorage.setItem("peerId", JSON.stringify(twiHand))
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

})
export default connect(mapStateToProps, { openHome, initiateSocket, validateTwitterHandle, stillAuthenicated })(HomeRoute)

