import React, { Component } from 'react'
import PropType from 'prop-types';
import ImagesOfExplainers from './DisplayExplained';


class DisplayIssue extends Component {
   


    render() {
        console.log("this.props.issueArray : ",(this.props.issueArray).length)
        var issueItems = null
      if((this.props.issueArray).length=== 0 ){
        issueItems =(<div className="emptyIssues">
            <p>Not participated in any discussions</p>
        </div>)
      }
      else{
        issueItems = this.props.issueArray.map((issue,index) => (
            <div key={index}  key={issue.issueid} className="issueCard">
                <div className="orginCard">
                    <div id={issue.issueid} onClick={this.props.togglemodal} className="topButtons">
                        <div>
                        </div>
                        <div>
                            </div>
                        <div id={issue.issueid} className="twitterHolder">
                           <div id={issue.issueid} className="twitter">
                                <img width="100%" height="100%" src={require('../../images/twitter3.png')}/>
                            </div>
                        </div>
                    </div >
                    <div id={issue.issueid} onClick={this.props.togglemodal} className="questionText">
                        <p id={issue.issueid} >{issue.textexplain}</p>
                    </div>
                    <div id={issue.issueid} onClick={this.props.togglemodal} className="questionImg">
                        <video autoPlay="true" muted controls  id={issue.issueid} width="100%" height="100%" src={issue.videofilepath} ></video>
                    </div>
                    
                </div>
                <div id={issue.issueid} className="explainAnswer">
                <ImagesOfExplainers issueid={issue.issueid} />
                    <div  className="explainIt">
                        <button id={issue.issueid} className="buttonDark explainItBtn" onClick={this.props.explainTool}>Explain it</button>
                    </div>
                </div>
            </div>
        ))
    }
        return (
            <div>
{issueItems}
              
            </div>
        )
    }
}

export default DisplayIssue

