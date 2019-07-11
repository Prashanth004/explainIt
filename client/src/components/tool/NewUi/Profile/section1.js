import React from 'react';
import TextArea from '../container/textArea';
import './prfile.css';
import { FiArrowRight } from "react-icons/fi";

export default (props) => {
    const {bioValue,changeBio,goodAtValue,changeGoodAt,SecTrans,worksValue,
        changeWorks,bioValueError,goodAtValueError} =props
    const bioErrorDiv = (bioValueError) ? (<div><span className="errorSpan">bio cant be more than 100 characters</span>
        <br/></div>) : (null);
    const goodAtErrorDiv = (goodAtValueError) ? (<div>
        <span className="errorSpan">Can not be more than 100 characters</span>
        <br/></div>) : (null);
    const enterPress = ()=>{}
  return (<div className="profileFormContainer" style={{textAlign:"centre", alignSelf:"centre"}}>
                    <span>Who am I?</span>
                    {/* <span className="support">   (200 characters)</span> */}
                    <br/>
                    {/* <span className="support">(optional)</span> */}
                    <TextArea
                    placeholder=""
                        textvalue={bioValue}
                        changeFunction={changeBio} 
                        enterPress={enterPress}
                        textAlign="left"
                        inputClass="inputboxes fullView" />
                    {bioErrorDiv}
                       <span>What am I good at?</span>
                    {/* <span className="support">   (150 characters)</span> */}
                    <br/>
                    {/* <span className="support">(optional)</span> */}
                    <TextArea
                     placeholder=""
                        textvalue={goodAtValue}
                        enterPress={enterPress}
                        changeFunction={changeGoodAt}
                        inputClass="inputboxes fullView" />
                    {goodAtErrorDiv}

                    <span>My works</span>
                    <br/>
                    {/* <span  className="support">(optional)</span> */}
                    <TextArea
                        textvalue={worksValue}
                        changeFunction={changeWorks} inputClass="inputboxes fullView" />
                       
                        <div style={{textAlign:"center", marginTop:"10px"}}>
                        <button  className="nextButton" onClick={SecTrans}><FiArrowRight style={{fontSize:"18px", marginTop:"-3px"}}/></button>
                        </div>
                  
                   {/* <button className="buttonLight" onClick={closeEditProfile}>Cancel</button> */}
                </div>)
}
