import React, { Component } from 'react'
import { connect } from 'react-redux';
import config from '../../../../config/config';
import { resetValues } from '../../../../actions/twitterApiAction'
import {resetLandingAction } from '../../../../actions/landingAction'
import {saveReferral} from '../../../../actions/referral'
class tweetToRefer extends Component {
    constructor(props){
        super(props)
        this.state={
            tweeted:false
        }
        this.tweeTRefer = this.tweeTRefer.bind(this);
        this.reRefer = this.reRefer.bind(this);
    }
 
    tweeTRefer = ()=>{
        this.setState({tweeted:true})
        var issueId = JSON.parse(localStorage.getItem('issueId'))
        var sharableURL = config.react_url + '/project/' + issueId;
        var text = 'Hi @'+this.props.twitterHandleValue+', I thought you could be the best fit to solve or explain this problem to @'+this.props.questionProject.twitterhandle+'. Thanks for checking it out.';
        var encSharableURL = encodeURI(sharableURL);
        var encText = encodeURI(text);
        var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
        var width = 650,
            height = 350,
            top = window.innerHeight / 8,
            left = window.innerWidth / 4,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);
        this.props.saveReferral(this.props.questionProject.id,this.props.id,this.props.twitterHandleValue,issueId)
    }
  
    reRefer(){
        this.props.resetLandingAction();
        this.props.resetValues();
    }
   
   
  render() {
      if(!this.state.tweeted ){
            this.tweeTRefer()
      }
    return (
      <div>
          <h5>Thanks for refering.</h5>
              <h5>You will be rewarded</h5>
          <span style={{color:"blue", fontSize:"12px"}} onClick={this.reRefer}>Refer again to another</span>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
    return {
      twitterHandleValue:state.landing.twitterHandleValue,
      clicked: state.landing.isClicked,
      inValidTwitterHandle:state.landing.inValidTwitterHandle,
      id:state.auth.id
    }
  }
  
  export default connect(mapStateToProps,{resetValues,saveReferral,resetLandingAction})(tweetToRefer);
