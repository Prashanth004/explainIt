

import React from 'react';
import { FiPower } from "react-icons/fi";
import { connect } from 'react-redux';
import { signout } from '../../../../actions/signinAction';
import { toggleHowWorksModal } from '../../../../actions/modalAction'

const settingMob = (props) => {
    return (<div style={{textAlign:"center"}}>
    <div style={{width:"120px",margin:"auto", marginTop:"90px"}}>
        <div style={{display:"grid",
        gridTemplateColumns:"60% 40%",
         borderBottomStyle:"solid",
         borderBottomColor:"#eee",
         paddingBottom:"10px",
         borderBottomWidth:"0.5px"}}
         onClick={props.signout}>
              <div><span>Logout</span></div>
              <div><FiPower fontSize="18px" /></div>
        </div>
        <div>
            <span onClick={props.toggleHowWorksModal}>How it works</span>
        </div>

    </div>
</div>)
}


const mapStateToProps = state => ({
    openHowItWorksModal: state.modal.openHowItWorksModal,
})
export default connect(mapStateToProps, {toggleHowWorksModal,signout})(settingMob)





  
