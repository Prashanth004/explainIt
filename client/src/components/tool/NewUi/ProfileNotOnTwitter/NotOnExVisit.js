import React from 'react'

export default (props) => {
  return (
    <div>
      <div>
            <h3><b>Looks like this person hasn't registered with Explain</b></h3>
            <div className="inviteMagic" style={props.inviteMagic}>
                <h5 >May be he can add lot of value being here</h5>
                <h5>Would you help him to know?</h5>
               <br/>
                <button className="buttonDark"
                    onClick={props.SendInvite}><i style={{color:"black"}}>  Invite</i></button>
            </div></div>
    </div>
  )
}
