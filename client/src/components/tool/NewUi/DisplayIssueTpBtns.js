import React, {Component} from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiDelete } from "react-icons/fi";
import '../../css/issueDetails.css';
import { FiTrash,FiMoreVertical } from "react-icons/fi";

export default class displayTopBtns extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayTwitter : "none",
            toolTipValue : "private",
            optionVisibe:"hidden"
            // visible
        }
        this.changeToggle = this.changeToggle.bind(this);
        this.onOptClick = this.onOptClick.bind(this);
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
    onOptClick(){
        if(this.state.optionVisibe==="hidden")
        this.setState({
            optionVisibe:"visible"
        })
        else{
            this.setState({
                optionVisibe:"hidden"
            }) 
        }
    }

    changeToggle(e){
        if(this.state.displayTwitter === "block"){
            this.setState({
                displayTwitter : "none",
                toolTipValue : "Private - only you can see this card"
            })
        }
        else{
            this.setState({
                displayTwitter:"block",
                toolTipValue : "Public - anyone can see this card"
            })
        }
        this.props.handlePublicPrives(e)
    }

    render() {
        // const twitterBird = (Number(this.props.issue.public)) ? (
        //     >) : (null)


        const deleteDiv = (this.props.itsHome) ? (
            <div>
            <div className="iconsright">
                
                    <FiMoreVertical onClick={this.onOptClick} />
               
            </div>
            <div className="dropDownForOption"  id={this.props.issue.issueid}  style={{visibility:this.state.optionVisibe}}>
            <div onClick={this.props.deleteProjects}  className="menuItem">
                <button  id={this.props.issue.issueid}  className="dropDownBtn">Delete</button>
                <span>  <FiTrash  id={this.props.issue.issueid}  className="menuIcon"/></span>
               
            </div>
            </div>
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
                            <span id={this.props.issue.issueid} className="hint--top" aria-label="Get shareable Link">
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

