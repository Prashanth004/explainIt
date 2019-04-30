import React, { Component } from 'react'
import config from '../../../config/config'
import {hideTextBoxAfterRecord} from '../../../actions/messageAction'
import {connect} from 'react-redux';
import PropType from  'prop-types'; 

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


        var textToBeDisplayed = "@" + this.props.twitterhandle + " Simplest way to share your screen. Better way to explain your thoughts. Get started now. Click on the link."
        var Url = config.react_url
        var encSharableURL = encodeURI(Url);
        var encText = encodeURI(textToBeDisplayed);


        var linkToBeShared = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL;
        // var linkToBeShared= "https://twitter.com/messages/compose?recipient_id="+props.twitterId
        // +this.props.twitterId.button+"&text="+encText+"&url="+encSharableURL;


        var sharableURL = config.react_url + '/project/' + this.props.twitterhandle;
        var text = "Discussions happened on explain";
        encSharableURL = encodeURI(sharableURL);
        encText = encodeURI(text);

        // var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
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
        var inviteContainer = null
        if (this.props.isVisitProfile) {
            displayInvite = { minHeight: "100vh",
        fontSize:"25px" }

            inviteMagic = {
                padding: "30px",
                marginTop: "85px;"
            }

            inviteContainer = {
                width: "40%",
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

        return (
            <div>
                <div style={displayInvite}>
                    <div className="inviteContainer" style={inviteContainer}>
                        <span>Looks like this person hasn't registered with Explain</span>
                        <div className="inviteMagic" style={inviteMagic}>
                            <span>May be he can add lot of value being here</span>
                            <span>Would you help him to know?</span>
                           <br/>
                            <button className="buttonDark twitterBtn"
                                onClick={this.SendInvite}><i className="fa fa-twitter twitterBtn">  Invite</i></button>
                        </div>
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





