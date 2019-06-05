import React, { Component } from 'react'
import config from '../../../../config/config'
import {hideTextBoxAfterRecord} from '../../../../actions/messageAction'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 
import VisitPage from './NotOnExVisit';
import SharePage from './NotOnExShare'

class ProfileNotFound extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
        this.SendInvite = this.SendInvite.bind(this)
    }
    componentWillMount(){
        this.props.hideTextBoxAfterRecord()
    }
    closeWindow() {
        window.location.close()
    }
    SendInvite(e) {
        const {twitterhandle} = this.props;
        var twitterHandleTemp = (twitterhandle.includes('@'))?
        (twitterhandle.replace("@","")):(twitterhandle)
        var textToBeDisplayed = "@" + twitterHandleTemp + " Simplest way to share your screen. Better way to explain your thoughts. Get started now. Click on the link."
        var Url = config.react_url
        var encSharableURL = encodeURI(Url);
        var encText = encodeURI(textToBeDisplayed);
        var linkToBeShared = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL;
        var width = 555,
            height = 300,
            top = window.innerHeight / 4,
            left = window.innerWidth / 4,
            url = linkToBeShared,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);
    }


    render() {
        var displayInvite = null
        var inviteMagic = null
        var inviteContainer = null;
    
        if (this.props.isVisitProfile) {
            displayInvite = { minHeight: "100vh",
        fontSize:"25px" }
            inviteMagic = {
                padding: "30px",
                marginTop: "85px;"
            }
            inviteContainer = {
                width: "60%",
                paddingTop: "105px"
            }
                  
        }
        else{
            displayInvite = {
                fontSize:"14px"
            }

            inviteMagic = {
                padding: "5px",
                marginTop: "3px"
            }

            inviteContainer = {
                width: "98%",
                paddingTop: "5px"
            }

        }
        const writing = (this.props.isVisitProfile)?(<VisitPage 
            SendInvite={this.SendInvite}
            inviteMagic={inviteMagic}/>
        ):(<SharePage 
            SendInvite={this.SendInvite}
            inviteMagic={inviteMagic}/>
        )

        return (
            <div>
                <div style={displayInvite}>
                    <div className="inviteContainer" style={inviteContainer}>
                            {writing}
                    </div>
                </div>
            </div>
        )
    }
}
ProfileNotFound.PropType={
    hideTextBoxAfterRecord:PropType.func.isRequired
}
const mapStateToProps = state =>({
   
}) 

export default connect(mapStateToProps,{
    hideTextBoxAfterRecord
})(ProfileNotFound)





