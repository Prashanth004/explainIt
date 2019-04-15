
import React, { Component } from 'react'
import TimerBar from '../TimerBar'
// import '../../../css/copyToClipboard.css'
import TweetSearch from '../tweetSearch';
import InputNumber from '../InputNumber';
import CopyToClipboard from '../../CopytoClipboard';
import config from '../../../../config/config'

export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            limitExce: false,
            emptyNumber: false,
            negNumber: false,
            noText: false,
            maxTimeForVideo: null,
            generatedLink: false,
            shareOptSelected: false,
            tweetAction: false

        }
        this.changeImputNumber = this.changeImputNumber.bind(this);
        this.genLink = this.genLink.bind(this);
        this.startBar = this.startBar.bind(this);
        this.updateShareActionToTweet = this.updateShareActionToTweet.bind(this)
        this.updateShareActionToShare = this.updateShareActionToShare.bind(this)
    }
    updateShareActionToTweet() {
        this.setState({
            shareOptSelected: true,
            tweetAction: true
        })
    }
    updateShareActionToShare() {
        this.setState({
            shareOptSelected: true,
            tweetAction: false
        })
    }
    componentWillMount() {
        this.setState({
            maxTimeForVideo: config.MAX_VIDEO_TIME_LIMIT
        })

    }
    componentDidMount() {
        // this.startBar()
    }
    genLink() {
        if (!this.state.noText
            && !this.state.negNumber
            && !this.state.emptyNumber) {
            this.setState({
                generatedLink: true
            })
            setTimeout(() => {
                this.startBar()
                setTimeout(() => {
                    this.props.expireTimer()
                }, config.LINK_EXPIRE_TIME * 60 * 1000)
            }, 500)
        }
    }
    startBar() {
        var self = this;
        var timeAloted = config.LINK_EXPIRE_TIME * 60
        var progressbar = document.querySelector('#pbar');
        var progresDiv = document.querySelector(".progresDiv")
        progresDiv.style.display = "block";
        var width = 100;
        var id = setInterval(frame, 1000);
        function frame() {
            if (width <= 0) {
                clearInterval(id);
            } else {
                width = width - (100 / timeAloted);
                // console.log("width: ", width)
                progressbar.style.width = width + '%';
            }
        }
    }
    changeImputNumber(e) {
        var noOfMinutestemp = e.target.value;
        console.log(typeof (noOfMinutestemp))
        console.log(Number(noOfMinutestemp))
        if (noOfMinutestemp.length !== 0 && Number(noOfMinutestemp) !== 0 && !Number(noOfMinutestemp)) {
            this.setState({
                noText: true
            })
        }
        else if (noOfMinutestemp.length !== 0 && noOfMinutestemp !== null && noOfMinutestemp > this.state.maxTimeForVideo) {
            this.setState({
                limitExce: true
            })
        }
        else if (noOfMinutestemp.length !== 0 && noOfMinutestemp.length > 0 && noOfMinutestemp < 1) {
            this.setState({
                negNumber: true
            })
        }
        else if (noOfMinutestemp.length === 0) {
            this.setState({
                emptyNumber: true
            })
        }
        else {
            this.setState({
                limitExce: false,
                negNumber: false,
                noText: false,
                emptyNumber: false
            })
        }
        this.props.setNoOfMinutes(e.target.value)


    }

    render() {
        const shareAction = this.state.shareOptSelected ? (



            (this.state.tweetAction) ? (
                <div className="twitterInput">


                </div>
            ) : (
                    <CopyToClipboard sharablelink={this.props.shareScreenLink} />
                )



        ) : (null)


        const tweetOrshare = (<div >
            
              
                    {/* <div style={{ width: "20px", height: "20px" }}> */}
                        {/* <span class="hint--top" aria-label="Share manually">
                        </span> */}
                    {/* </div> */}
                    <CopyToClipboard sharablelink={this.props.shareScreenLink} />

            {shareAction}
        </div>)
        return(
              <div>
                    The link expires in {config.LINK_EXPIRE_TIME} minutes
                    {/* <TimerBar /> */}
                    {tweetOrshare}
                </div>
               
          
        ) 
    }




}