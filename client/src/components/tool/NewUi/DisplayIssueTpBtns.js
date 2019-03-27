import React from 'react'
import Toggle from 'react-toggle';
import { FiLink2, FiDelete } from "react-icons/fi";

export default (props) => {
    const deleteDiv=(props.itsHome)?(
        <div className="iconsright">
        <span className="hint--top" aria-label="Delete">
            <FiDelete id={props.issue.issueid} onClick={props.deleteProjects} />
        </span>
    </div>
    ):(null)
    const publictoggle = (props.itsHome)?(
        <label id={props.issue.issueid}>
        <span className="hint--top" aria-label="Public">
            <Toggle
                id={props.issue.issueid}
                defaultChecked={Number(props.issue.public)}
                className='custom-classname'
                icons={false}
                onChange={props.handlePublicPrives} />
        </span>
    </label>
    ):(null)
  return (
    <div>
       <div id={props.issue.issueid} className="topButtons">
                            <div id={props.issue.issueid} className="sharableLinkCard">
                                <div id={props.issue.issueid} onClick={props.toggleDisplayLink} className="icons">
                                    <span id={props.issue.issueid} className="hint--top" aria-label="Get shareable Linkn">
                                        <FiLink2 id={props.issue.issueid} className="linkElementSym" id={props.issue.issueid} />
                                    </span>
                                </div>
                                <div>
                                   {publictoggle}
                                </div>
                                <div>

                                </div>
                            </div>
                            <div id={props.issue.issueid} >
                                <div id={props.issue.issueid} className="twitter">
                                    <img id={props.issue.issueid} width="100%" height="100%" onClick={props.tweetWindow} src={require('../../images/twitter3.png')} />
                                </div>
                            </div>
                            <div id={props.issue.issueid} className="twitterHolder">

                               {deleteDiv}
                                {/* <button  id={props.issue.issueid} className="buttonDark twitterBtn"
                       onClick={this.tweetWindow}><i class="fa fa-twitter twitterBtn">  Tweet</i></button> */}

                            </div>
                        </div >
    </div>
  )
}
