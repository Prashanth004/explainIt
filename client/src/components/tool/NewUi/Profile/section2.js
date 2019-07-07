import React from 'react';
import { FiArrowLeft, FiSave } from "react-icons/fi";
import './prfile.css';
import { FiGithub, FiLinkedin, FiEdit, FiTwitter } from "react-icons/fi";



export default (props) => {
    const {angelListError,gitHibError,linkInerror,SecTrans,linkedInValue,changeAngelList,
        uploadData, gitHubValue,angelListValue,changeLinkedIn,changeGithub}= props
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
  return (<div className="profileFormContainer socialProfile" >
         <span style={{
                            float: "left",
                            fontSize: "15px",
                            marginTop:"-55px",
                            marginLeft:"-25px"
                        }}>
                            <FiArrowLeft  onClick={SecTrans} />
                        </span>
      <div><span><b><FiLinkedin style={{fontSize:"18px", marginTop:"-2px"}}/> /</b></span>
               
                {/* <span  className="support">(optional)</span> */}
                <input
                type="text" 
                    value={linkedInValue}
                    onChange={changeLinkedIn} className="inputboxes" />
                {linkedinerrorDiv}
                <br/>
                <br/>
                <span><b><FiGithub style={{fontSize:"18px", marginTop:"-2px"}}/>/</b></span>
            
                
                {/* <span  className="support">(optional)</span> */}
                <input
                    value={gitHubValue}
                    type="text" onChange={changeGithub} className="inputboxes" />
                {githuerrorDiv}
                <br/>
                <br/>
                <span>  <img  alt="ang"src={require('../../../images/angellist.svg')}
                                        width="19px" height="19px" style={{ marginTop:"-2px"}}></img>/</span>
                {/* <br/> */}
               
                {/* <span  className="support">(optional)</span> */}
                <input
                    value={angelListValue}
                    type="text" onChange={changeAngelList} className="inputboxes" />
                {angelerrorDiv}
               
                {/* <button className="buttonLight" onClick={closeEditProfile}>Cancel</button> */}
                {/* <button className="buttonLight" onClick={uploadData}>Submit</button> */}
                <div style={{textAlign:"center", marginTop:"30px"}}>
                    <button  className="nextButton" onClick={uploadData}><FiSave style={{fontSize:"18px", marginTop:"-3px"}}/></button>
                </div>
                </div>
    </div>
  )
}
