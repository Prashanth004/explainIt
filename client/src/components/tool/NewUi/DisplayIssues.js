import React, { Component } from 'react'
import PropType from 'prop-types';
import { connect } from 'react-redux';
import ImagesOfExplainers from '../../DisplayExplained';
import { IoIosLink } from "react-icons/io";
import CopyToClipboard from '../CopytoClipboard'
import config from '../../../config/config'
import {deleteProjects} from '../../../actions/projectActions';
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";
import { confirmAlert } from 'react-confirm-alert'; // Import



class DisplayIssue extends Component {
   constructor(props){
       super(props)
       this.state={
        displayCopyEle:false,
        projectId:null,
        deleteItemId:null,
        issueArray:this.props.issueArray
       }
       this.toggleDisplayLink  = this.toggleDisplayLink.bind(this);
       this.deleteProjects = this.deleteProjects.bind(this);
       this.handleConfirm = this.handleConfirm.bind(this)
   }

   deleteProjects(e){
       this.setState({
           deleteItemId : e.target.id
       })
    confirmAlert({
        title: "Are you sure?",
        message: "You won't be able to revert this!",
        buttons: [
            {
                label: 'Yes',
                onClick: () => this.handleConfirm()
            },
            {
                label: 'No',
                onClick: () => this.handleCancel()
            }
        ]
    })
   }
   handleCancel(){

   }

   handleConfirm(){
    var id = this.state.deleteItemId
     this.props.deleteProjects(id);
    // document.querySelector('#'+this.state.deleteItemId).style.display = "none"
    const newState = this.state;
    const index = newState.issueArray.findIndex(a => a.issueid === id);

    if (index === -1) return;
    newState.issueArray.splice(index, 1);

    this.setState(newState); // 

   }
   displaySuccessDelete(){
    Swal.fire({
        type: 'success',
        title: 'Delete successFull',
        timer: 1500,
        showConfirmButton: false,
      })

      this.props.restoredelete()

   }
   tweetWindow(e){
    var sharableURL =config.react_url + '/project/' + e.target.id;
    var text = "Discussions happened on explain";
    var encSharableURL =  encodeURI(sharableURL);
    var encText = encodeURI(text);
   
    var href="https://twitter.com/intent/tweet?text="+encText+"&url="+encSharableURL
    var width  = 555,
        height = 300,
        top = window.innerHeight/4,
        left=window.innerWidth/4,
        url    = href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    window.open(url, 'twitter', opts);
    
   }

   toggleDisplayLink(e){
    this.setState({
        projectId: e.target.id,
        displayCopyEle:!this.state.displayCopyEle,
    })
}

    render() {
        console.log("this.state.issueArray : ",(this.state.issueArray).length)
        var issueItems = null;
        if(this.state.displayCopyEle){
            var copyElement = ( <div className="copyDisplay">
            <CopyToClipboard sharablelink = {config.react_url + '/project/' + this.state.projectId} />
            </div>)
        }
        else{
            var copyElement = null
        }
      if((this.state.issueArray).length=== 0 ){
        issueItems =(<div className="emptyIssues">
            <p>Not participated in any discussions</p>
        </div>)
      }
      else{
        issueItems = this.state.issueArray.map((issue,index) => (
            <div key={index}  key={issue.issueid} className="issueCard">
                <div className="orginCard">
                    <div id={issue.issueid}  className="topButtons">
                        <div  id={issue.issueid} className="sharableLink">
                        <span className="hint--top" aria-label="Get shareable Linkn">
                            <IoIosLink  className="linkElementSym"id={issue.issueid} onClick={this.toggleDisplayLink}/>
                        </span>
                        <span className="hint--top" aria-label="Delete">

                        <MdDelete id={issue.issueid}  onClick={this.deleteProjects}/>
                        </span>
                        </div>
                        <div id={issue.issueid} >
                            {/* <button id={issue.issueid} onClick={this.deleteProjects} >delete</button> */}
                            </div>
                        <div id={issue.issueid} className="twitterHolder">
                        
                        <button  id={issue.issueid} className="buttonDark twitterBtn"
                       onClick={this.tweetWindow}><i class="fa fa-twitter twitterBtn">  Tweet</i></button>
                           {/* <div id={issue.issueid} className="twitter">
                                <img width="100%" height="100%" src={require('../../images/twitter3.png')}/>
                            </div> */}
                        </div>
                    </div >
                    {copyElement}
                    <div id={issue.issueid} onClick={this.props.togglemodal} className="questionText">
                        <p id={issue.issueid} >{issue.textexplain}</p>
                    </div>
                    <div id={issue.issueid} onClick={this.props.togglemodal} className="questionImg">
                        <video  controls  id={issue.issueid} width="100%" height="100%" src={issue.videofilepath} ></video>
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

DisplayIssue.PropType = {
    deleteProjects : PropType.func.isRequired,
   
};
const mapStateToProps = state => ({
   
})

export default connect(mapStateToProps, {deleteProjects,
   
 
})(DisplayIssue)




