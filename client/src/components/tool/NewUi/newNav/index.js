import { FiMail, FiPhone, FiSettings } from "react-icons/fi";
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import config from '../../../../config/config'
import { openHome, openSettings, openInbox, openCreated, openParticipated } from '../../../../actions/navAction'

class MobNav extends Component {
    constructor(props) {
        super(props);
        this.state = { openHomeRed: false, openInboxRed: false }
        this.openHomeLoc = this.openHomeLoc.bind(this);
        this.openCreatedLoc = this.openCreatedLoc.bind(this);
        this.openInboxLoc = this.openInboxLoc.bind(this);
        this.openSettingsLoc = this.openSettingsLoc.bind(this);
    }
    openSettingsLoc(){
      
            this.props.openSettings();
            // if (!this.props.Setting)
            //     this.setState({ openHomeRed: true, openInboxRed: false })
       
    }
    openHomeLoc() {
        const { page } = this.props;
        if (page === config.HOME_PAGE) {
            this.props.openHome();
            this.setState({ openHomeRed: true, openInboxRed: false })
        }
        else {
            this.props.openHome();
        }
    }

    openInboxLoc() {
        const { page } = this.props;
        if (page === config.HOME_PAGE) {
            this.props.openInbox();
            if (!this.props.Created && !this.props.Created && !this.props.Setting){
                this.setState({ openInboxRed: true, openHomeRed: false })
               
            }
               
        }
    }
    openCreatedLoc() {

        const { page } = this.props;
        this.props.openCreated();
        if (page === config.HOME_PAGE) {
            if (!this.props.inbox && !this.props.Created && !this.props.Setting){
                this.setState({ openInboxRed: true });
            }
        }
        else if (page === config.VISIT_PROFILE_PAGE) {
            this.props.openCreated();
        }

    }
    render() {
        console.log("this.props.page : ", this.props.page)
        const openHomeDiv = this.state.openHomeRed ? (<Redirect push to={'../@'+this.props.authTwitterHandle+'/'} />) : (null);
        const openInboxDiv = this.state.openInboxRed ? (<Redirect push to={'./@'+this.props.authTwitterHandle+'/activities'} />) : (null)
        const { page } = this.props;
        const divStyle = {
            textAlign: "center",
            borderStyle: "solid",
            borderTopStyle: "none",
            borderWidth: "0.5px",
            borderColor: "#eee",
        }

        return (

            <div style={{
                height: "55px",
                display: "grid",
                gridTemplateColumns: "25% 25% 25% 25%",
                width: "100%",
                position: "fixed",
                bottom: "0px",
                borderStyle: "solid",
                borderWidth: "0.5px",
                borderColor: "#ddd",
                backgroundColor: "white",
                zIndex: "5000"
            }}>
                {openHomeDiv}
                {openInboxDiv}
                <div style={divStyle} onClick={this.openHomeLoc}>
                    <img src={require('../../../images/logo5.png')} width="25px" height="25px" alt="logo" style={{ margin: "auto", marginTop: "5px" }}></img>
                </div>
                <div style={divStyle} onClick={this.openInboxLoc} >
                    <FiPhone style={{ fontSize: "23px", margin: "auto", marginTop: "10px", color: (page === config.HOME_PAGE) ? ((this.props.inbox) ? "#40a8ac" : "black") : "#ddd" }} />

                </div>
                <div style={divStyle} onClick={this.openCreatedLoc}>
                    <FiMail style={{ fontSize: "23px", margin: "auto", marginTop: "10px", color: (page === config.HOME_PAGE || page === config.VISIT_PROFILE_PAGE) ? ((this.props.Created) ? "#40a8ac" : "black") : "#ddd" }} />

                </div>
                <div  onClick={this.openSettingsLoc} style={divStyle}>
                    <FiSettings  style={{ fontSize: "23px", margin: "auto", marginTop: "10px", color: (this.props.Setting) ? "#40a8ac" : "black" }} />
                </div>

            </div>


        )
    }
}


const mapStateToProps = state => ({
    Home: state.nav.openHome,
    Created: state.nav.openCreated,
    inbox: state.nav.openInbox,
    Participated: state.nav.openParticipated,
    Setting: state.nav.openSetting,
    authTwitterHandle: state.auth.twitterHandle,

})
export default connect(mapStateToProps, { openHome, openSettings, openInbox, openCreated, openParticipated })(MobNav)




