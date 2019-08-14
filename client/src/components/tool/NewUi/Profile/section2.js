import React from 'react';
import { FiArrowLeft, FiSave } from "react-icons/fi";
import './prfile.css';
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default (props) => {
    const {angelListError,gitHibError,linkInerror,SecTrans,linkedInValue,changeAngelList,
        uploadData, gitHubValue,angelListValue,changeLinkedIn,changeGithub}= props
        const gitHubValueDis = gitHubValue!==null?((!gitHubValue.includes('github.com'))?(gitHubValue):(gitHubValue.split('com')[1].split('/')[1])):(null)
        const linkedInValueDis = linkedInValue!==null?((!linkedInValue.includes('www.linkedin.com'))?(linkedInValue):(linkedInValue.split('com')[1].split('/')[1]+'/'+linkedInValue.split('com')[1].split('/')[2])):(null)
        const angelListValueDis = angelListValue!==null?((!angelListValue.includes('angel.co'))?(angelListValue):(angelListValue.split('co')[1].split('/')[1])):(null)
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
                <input
                type="text" 
                    value={linkedInValueDis}
                    onChange={changeLinkedIn} className="inputboxes" />
                {linkedinerrorDiv}
                <br/>
                <br/>
                <span><b><FiGithub style={{fontSize:"18px", marginTop:"-2px"}}/>/</b></span>
                <input
                    value={gitHubValueDis}
                    type="text" onChange={changeGithub} className="inputboxes" />
                {githuerrorDiv}
                <br/>
                <br/>
                <span>  <img  alt="ang"src={require('../../../images/angellist.svg')}
                                        width="19px" height="19px" style={{ marginTop:"-2px"}}></img>/</span>
                <input
                    value={angelListValueDis}
                    type="text" onChange={changeAngelList} className="inputboxes" />
                {angelerrorDiv}
                <div style={{textAlign:"center", marginTop:"30px"}}>
                    <button  className="nextButton" onClick={uploadData}><FiSave style={{fontSize:"18px", marginTop:"-3px"}}/></button>
                </div>
                </div>
    </div>
  )
}
