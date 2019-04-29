import React, { Component } from 'react'
import PropType from 'prop-types';
import { connect } from 'react-redux';
import config from '../../../config/config'
import { deleteProjects, checkPublicValue } from '../../../actions/projectActions';

import '../../css/toggle.css'
import IssueCard from './issueCard'
import { confirmAlert } from 'react-confirm-alert'; // Import4
import DisplayIssueTopBtns from './DisplayIssueTpBtns'




class DisplayIssue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayCopyEle: false,
            projectId: null,
            deleteItemId: null,
            issueArray: null,
            dropdownOpen: false,
            itsHome: false
        }
        this.toggleDisplayLink = this.toggleDisplayLink.bind(this);
        this.deleteProjects = this.deleteProjects.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePublicPrives = this.handlePublicPrives.bind(this)
    }
    componentWillMount() {
        this.setState({
            issueArray: null

        })
        if (this.props.home === config.HOME)
            this.setState({
                itsHome: true
            })
        else
            this.setState({
                itsHome: false
            })
    }
    componentDidMount(){
        this.setState({
            issueArray :this.props.issueArray.reverse()
        })
    }

    deleteProjects(e) {
        console.log("e.target.id : ", e.target.id)
        this.setState({
            deleteItemId: e.target.id
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
    handleCancel() {

    }

    handleConfirm() {
        var id = this.state.deleteItemId
        console.log(this.state.issueArray)
        this.props.deleteProjects(id);
        const newState = this.state;
        const index = newState.issueArray.findIndex(a => a.issueid === id);

        if (index === -1) {
            console.log("nothing found")
            return;
        }
        
       
        newState.issueArray.splice(index, 1);

        this.setState(newState); // 

    }
    
    tweetWindow(e) {
        var sharableURL = config.react_url + '/project/' + e.target.id;
        var text = "Discussions happened on explain";
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

    }
    handlePublicPrives(e) {
        this.props.checkPublicValue(e.target.id)
    }
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    toggleDisplayLink(e) {
        console.log("counting")
        // this.setState({
        //     projectId: e.currentTarget.id,
        //     displayCopyEle: !this.state.displayCopyEle,
        // })
        var element = document.querySelector('#clipboard_' + e.currentTarget.id)
        if (element.style.display === 'none') {
            element.style.display = 'block'
        }
        else {
            element.style.display = 'none'
        }
    }

    render() {
        var issueItems = null;
      if(this.props.issueArray !== null){
        if ((this.props.issueArray).length === 0) {
            if(this.props.created){
                issueItems = (<div className="emptyIssues">
                <h4>Empty</h4>
                <br/>
                <h6>If you have initiated a screen share or record the screen, the recordings with respect to these will be found here</h6>
                <br/>
                <h6>You can have it hidden form others to view it or you can let others view it and contribute to the recorded content</h6>
            </div>)
            }
            if(this.props.participated){
                issueItems = (<div className="emptyIssues">
                <h4>Empty</h4>
                <br/>
                <h6>If you have explained anyone by recording or sharing your screen, you will find the recordings related to them here</h6>
                <br/>
            </div>)
            }
           
        }
        else {
            // const issueItemReverse = (this.props.issueArray).reverse()
            // console.log("issueItemReverse : ", issueItemReverse)
            issueItems =this.props.issueArray.reverse().map((issue, index) => (
               <IssueCard 
               itsHome={this.state.itsHome}
               displayCopyEle={this.state.displayCopyEle}
               deleteProjects={this.deleteProjects}
               tweetWindow={this.tweetWindow}
               handlePublicPrives={this.handlePublicPrives}
               toggle={this.toggle}
               toggleDisplayLink={this.toggleDisplayLink}
               projectId={this.state.projectId}
               issue={issue}
               explainTool={this.props.explainTool}/>
            ))
        }
      }
        
        return (
            <div>
                {issueItems}

            </div>
        )
    }
}

DisplayIssue.PropType = {
    deleteProjects: PropType.func.isRequired,
    checkPublicValue: PropType.func.isRequired

};
const mapStateToProps = state => ({
 participated: state.nav.openParticipated,
    created: state.nav.openCreated,
})

export default connect(mapStateToProps, {
    deleteProjects, checkPublicValue


})(DisplayIssue)




