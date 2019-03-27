import React, { Component } from 'react'
import PropType from 'prop-types';
import { connect } from 'react-redux';
import ImagesOfExplainers from '../../DisplayExplained';
import CopyToClipboard from '../CopytoClipboard'
import config from '../../../config/config'
import { deleteProjects, checkPublicValue } from '../../../actions/projectActions';
import Swal from 'sweetalert2';
import '../../css/toggle.css'
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
            issueArray: this.props.issueArray

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

    deleteProjects(e) {
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
        this.props.deleteProjects(id);
        const newState = this.state;
        const index = newState.issueArray.findIndex(a => a.issueid === id);

        if (index === -1) return;
        newState.issueArray.splice(index, 1);

        this.setState(newState); // 

    }
    displaySuccessDelete() {
        Swal.fire({
            type: 'success',
            title: 'Delete successFull',
            timer: 1500,
            showConfirmButton: false,
        })

        this.props.restoredelete()

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
        console.log(e.currentTarget.id)
        this.setState({
            projectId: e.currentTarget.id,
            displayCopyEle: !this.state.displayCopyEle,
        })
        var element = document.querySelector('#clipboard_' + e.currentTarget.id)
        if (element.style.display === 'none') {
            element.style.display = 'block'
        }
        else {
            element.style.display = 'none'
        }
    }

    render() {
        console.log("this.state.issueArray : ", (this.state.issueArray).length)
        var issueItems = null;
        if (this.state.displayCopyEle) {
            var copyElement = (<div className="copyDisplay">
                <CopyToClipboard sharablelink={config.react_url + '/project/' + this.state.projectId} />
            </div>)
        }
        else {
            var copyElement = null
        }
        if ((this.state.issueArray).length === 0) {
            issueItems = (<div className="emptyIssues">
                <p>Not participated in any discussions</p>
            </div>)
        }
        else {
            issueItems = this.state.issueArray.map((issue, index) => (
                <div key={issue.issueid} className="issueCard">
                    <div className="orginCard">
                       <DisplayIssueTopBtns
                       issue={issue}
                       toggleDisplayLink={this.toggleDisplayLink} 
                       tweetWindow = {this.tweetWindow}
                       deleteProjects= {this.deleteProjects}
                       itsHome = {this.state.itsHome}/>
                        {/* {copyElement} */}
                        <div className="copyDisplay" id={"clipboard_" + issue.issueid} style={{ display: "none" }}>
                            <CopyToClipboard sharablelink={config.react_url + '/project/' + this.state.projectId} />
                        </div>
                        <div id={issue.issueid} onClick={this.props.togglemodal} className="questionText">
                            <p id={issue.issueid} >{issue.textexplain}</p>
                        </div>
                        <div id={issue.issueid} onClick={this.props.togglemodal} className="questionImg">
                            <video controls id={issue.issueid} width="100%" height="100%" src={issue.videofilepath} ></video>
                        </div>

                    </div>
                    <div id={issue.issueid} className="explainAnswer">
                        <ImagesOfExplainers issueid={issue.issueid} />
                        <div className="explainIt">
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
    deleteProjects: PropType.func.isRequired,
    checkPublicValue: PropType.func.isRequired

};
const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {
    deleteProjects, checkPublicValue


})(DisplayIssue)




