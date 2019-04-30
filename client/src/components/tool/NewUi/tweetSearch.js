import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import TweetSuggest from './TweetSug'
import { getRecpientId,getTwitterHandles, resetValues } from '../../../actions/twitterApiAction'


class tweetSearch extends Component {
    constructor(props){
        super(props)
        this.state={
            twitterHandle: '',
            tweetTested: false,
            
        }
        this.testHandle = this.testHandle.bind(this);
        this.updateTwitterHandleBox = this.updateTwitterHandleBox.bind(this);
        this.tweetTheMessage = this.tweetTheMessage.bind(this)
    }
    componentWillMount(){
        this.props.resetValues();
        this.props.getTwitterHandles();

    }
    testHandle() {
        if(!this.props.limitExce &&
        !this.props.negNumber)
        {
            this.setState({
                tweetTested: true
            })
            this.props.getRecpientId(this.state.twitterHandle)
        }
    }
    updateTwitterHandleBox(e,value) {
        this.setState({
            twitterHandle: value,
            tweetTested: false
        })
        this.props.resetValues();
    }
    sendRecordding(){

    }
    tweetTheMessage() {
        var self = this
        var sharableURL = this.props.shareScreenLink
        if(this.state.twitterHandle){
            var twitterHandleFinal = this.state.twitterHandle.replace("@","")
        }
        else{
            var twitterHandleFinal = null
        }
        this.setState({
            tweetTested: false
        })
       
        var text = "@" + twitterHandleFinal + " This is an invite link to join my screen share";
        var encSharableURL = encodeURI(sharableURL);
        var encText = encodeURI(text);

        var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
        var width = 555,
            height = 300,
            top = window.innerHeight / 4,
            left = window.innerWidth / 4,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);

        // this.props.resetValues();
        this.props.channgeTeet()
        setTimeout(() => {
            self.setState({
                doneTweeting: true
            })
        }, 1000)
    }
  render() {
      var validatinginfo = null
    if (this.state.tweetTested && !this.props.doneFetching) {
        validatinginfo = (<p className="info">checking handle validity</p>)
    }
    if (this.props.doneFetching && this.state.tweetTested && this.props.twitterHandleValid) {
        this.tweetTheMessage()
    }
    if (this.state.tweetTested && this.props.doneFetching && !this.props.twitterHandleValid) {
        validatinginfo = (<div>
            <p className="info">Incorrect twitter handle<br />
                Please check and try again</p>
        </div>
        )
    }
    return (
      <div>
          <div></div>
          <TweetSuggest
           onChange={this.updateTwitterHandleBox}
           placeholder="Enter @username"
           classOfInput="myInput"
           tweetTextvalue={this.state.twitterHandle}
           array = {this.props.twiterHandleArray}

           />
         
                <button className="buttonDark" onClick={this.testHandle}>Tweet</button>
                {validatinginfo}
      </div>
    )
  }
}

tweetSearch.PropType = {
    getRecpientId: PropType.func.isRequired,
    resetValues: PropType.func.isRequired,
    getTwitterHandles:PropType.func.isRequired
}
const mapStateToProps = state => ({


twitterHandleValid: state.twitterApi.profilePresent,
doneFetching: state.twitterApi.doneFetching,
twiterHandleArray : state.twitterApi.twitterHandle
})
export default connect(mapStateToProps, {getTwitterHandles, getRecpientId, resetValues})(tweetSearch)

