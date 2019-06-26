import React from 'react';
import { FiArrowLeft } from "react-icons/fi";

export default (props) => {
    const {angelListError,gitHibError,linkInerror,SecTrans,linkedInValue,changeAngelList,
        uploadData, closeEditProfile,gitHubValue,angelListValue,changeLinkedIn,changeGithub}= props
    const angelerrorDiv = (angelListError) ? (<div>
        <span className="errorSpan">invalid angel list URL</span>
        <br/></div>) : (null)
    const githuerrorDiv = (gitHibError) ? (
        <div>
        <span className="errorSpan">invalid github URL</span>
        <br/></div>) : (null)
    const linkedinerrorDiv = (linkInerror) ? (
        <div>
        <span className="errorSpan">invalid linkedin URL</span>
        <br/>
        </div>

    ) : (null)
  return (<div className="profileFormContainer">
         <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-55px",
                            marginLeft:"-25px"
                        }}>
                            <FiArrowLeft  onClick={SecTrans} />
                        </span>
      <div><span><b>LinkedIn :</b></span>
                <br/>
                <span  className="support">(optional)</span>
                <input
                type="text" 
                    value={linkedInValue}
                    onChange={changeLinkedIn} className="inputboxes" />
                {linkedinerrorDiv}
                <span><b>GitHub :</b></span>
                <br/>
                
                <span  className="support">(optional)</span>
                <input
                    value={gitHubValue}
                    type="text" onChange={changeGithub} className="inputboxes" />
                {githuerrorDiv}
                <span><b>Angel List :</b></span>
                <br/>
               
                <span  className="support">(optional)</span>
                <input
                    value={angelListValue}
                    type="text" onChange={changeAngelList} className="inputboxes" />
                {angelerrorDiv}
               
                <button className="buttonLight" onClick={closeEditProfile}>Cancel</button>
                <button className="buttonLight" onClick={uploadData}>Submit</button>
                </div>
    </div>
  )
}
