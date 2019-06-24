import React from 'react'

export default (props) => {
    const {bioValue,changeBio, closeEditProfile,goodAtValue,changeGoodAt,SecTrans,worksValue,
        changeWorks,bioValueError,goodAtValueError} =props
    const bioErrorDiv = (bioValueError) ? (<div><span className="errorSpan">bio cant be more than 200 characters</span>
        <br/></div>) : (null);
    const goodAtErrorDiv = (goodAtValueError) ? (<div>
        <span className="errorSpan">Can not be more than 150 characters</span>
        <br/></div>) : (null);
  return (<div className="profileFormContainer">
                    <span><b>Who am I</b></span>
                    <span className="support">   (200 characters)</span>
                    <br/>
                    <span className="support">(optional)</span>
                    <textarea
                        value={bioValue}
                        rows="6" onChange={changeBio} className="inputboxes" />
                    {bioErrorDiv}
                       <span><b>What am I good at</b></span>
                    <span className="support">   (150 characters)</span>
                    <br/>
                    <span className="support">(optional)</span>
                    <textarea
                        value={goodAtValue}
                        rows="3" onChange={changeGoodAt} className="inputboxes" />
                    {goodAtErrorDiv}

                    <span><b>My works</b></span>
                    <br/>
                    <span  className="support">(optional)</span>
                    <textarea
                        value={worksValue}
                        rows="3" onChange={changeWorks} className="inputboxes" />
                   <button  className="buttonLight" onClick={SecTrans}>Next </button>
                   <button className="buttonLight" onClick={closeEditProfile}>Cancel</button>
                </div>)
}
