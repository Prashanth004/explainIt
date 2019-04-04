import React, {Component} from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiDelete } from "react-icons/fi";
import '../../css/issueDetails.css'

export default class displayTopBtns extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayTwitter : "none",
            toolTipValue : "private"
        }
        this.changeToggle = this.changeToggle.bind(this)
    }
    componentDidMount(){
        if(Number(this.props.issue.public)){
            this.setState({
                displayTwitter : "block",
                toolTipValue : "public"
            })
        }
        else{
            this.setState({
                displayTwitter:"none",
                toolTipValue : "private"
            })
        }
    }

    changeToggle(e){
        if(this.state.displayTwitter === "block"){
            this.setState({
                displayTwitter : "none",
                toolTipValue : "private"
            })
        }
        else{
            this.setState({
                displayTwitter:"block",
                toolTipValue : "public"
            })
        }
        this.props.handlePublicPrives(e)
    }

    render() {
        // const twitterBird = (Number(this.props.issue.public)) ? (
        //     >) : (null)


        const deleteDiv = (this.props.itsHome) ? (
            <div className="iconsright">
                <span className="hint--top" aria-label="Delete">
                    <FiDelete id={this.props.issue.issueid} onClick={this.props.deleteProjects} />
                </span>
            </div>
        ) : (null)

        const publictoggle = (this.props.itsHome) ? (

            <label id={this.props.issue.projectid}>
                <span className="hint--top" aria-label={this.state.toolTipValue}>
                    <Toggle
                        id={this.props.issue.projectid}
                        defaultChecked={Number(this.props.issue.public)}
                        className='custom-classname'
                        icons={false}
                        onChange={this.changeToggle} />
                </span>
            </label>) : (null)
        return (
            <div>
                <div id={this.props.issue.issueid} className="topButtons">
                    <div id={this.props.issue.issueid} className="sharableLinkCard">
                        <div id={this.props.issue.issueid} onClick={this.props.toggleDisplayLink} className="icons">
                            <span id={this.props.issue.issueid} className="hint--top" aria-label="Get shareable Linkn">
                                <FiLink2 id={this.props.issue.issueid} className="linkElementSym" id={this.props.issue.issueid} />
                            </span>
                        </div>
                        <div>
                            {publictoggle}
                        </div>
                        <div>

                        </div>
                    </div>
                    <div id={this.props.issue.issueid} >
                        <div style={{display : this.state.displayTwitter}}id={this.props.issue.issueid} className="twitter">
                            <span id={this.props.issue.issueid} className="hint--top" aria-label="Tweet it">

                                <img id={this.props.issue.issueid} width="100%" height="100%" onClick={this.props.tweetWindow} src={require('../../images/twitter3.png')} />
                            </span >
                        </div>
                    </div>
                    <div id={this.props.issue.issueid} className="twitterHolder">

                            {deleteDiv}
                            {/* <button  id={this.props.issue.issueid} className="buttonDark twitterBtn"
                       onClick={this.tweetWindow}><i class="fa fa-twitter twitterBtn">  Tweet</i></button> */}

                        </div>
                    </div >
                </div>
                )
            }
        }
        
        
// import React, {Component} from 'react'
                
// export default class componentName extends Component {
//   render() {
//     return (
//       <div>

//       </div>
//     )
//   }
// }

