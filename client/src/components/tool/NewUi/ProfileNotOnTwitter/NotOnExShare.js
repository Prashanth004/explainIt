import React from 'react'

export default (props) => {
  return (
    <div>
      <div>
            <span >Looks like this person hasn't registered with Explain.</span>
            <div className="inviteMagic" style={props.inviteMagic}>
                <span >May be he can add lot of value being here. </span>
                <span> Would you help him to know?</span>
               <br/>
                <button className="buttonDark"
                    onClick={props.SendInvite}><i style={{color:"black"}}>  Invite</i></button>
            </div>
            </div>
    </div>
  )
}
