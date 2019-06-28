import React from 'react';
import TextArea from '../container/textArea';

export default (props) => {
    const {bioValue,changeBio, closeEditProfile,goodAtValue,changeGoodAt,SecTrans,worksValue,
        changeWorks,bioValueError,goodAtValueError} =props
    const bioErrorDiv = (bioValueError) ? (<div><span className="errorSpan">bio cant be more than 200 characters</span>
        <br/></div>) : (null);
    const goodAtErrorDiv = (goodAtValueError) ? (<div>
        <span className="errorSpan">Can not be more than 150 characters</span>
        <br/></div>) : (null);
  return (<div className="profileFormContainer">
                    <span>Who am I?</span>
                    {/* <span className="support">   (200 characters)</span> */}
                    <br/>
                    {/* <span className="support">(optional)</span> */}
                    <TextArea
                        textvalue={bioValue}
                        changeFunction={changeBio} 
                        inputClass="inputboxes" />
                    {bioErrorDiv}
                       <span>What am I good at?</span>
                    {/* <span className="support">   (150 characters)</span> */}
                    <br/>
                    {/* <span className="support">(optional)</span> */}
                    <TextArea
                        textvalue={goodAtValue}
                        changeFunction={changeGoodAt}
                        inputClass="inputboxes" />
                    {goodAtErrorDiv}

                    <span>My works</span>
                    <br/>
                    {/* <span  className="support">(optional)</span> */}
                    <TextArea
                        textvalue={worksValue}
                        changeFunction={changeWorks} inputClass="inputboxes" />
                   <button  className="buttonLight" onClick={SecTrans}>Next </button>
                   <button className="buttonLight" onClick={closeEditProfile}>Cancel</button>
                </div>)
}
