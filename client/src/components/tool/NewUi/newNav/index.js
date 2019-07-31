import React from 'react'
import { FiMail,FiPhone, FiSettings } from "react-icons/fi";
import { connect } from 'react-redux';
import config from '../../../../config/config'
import { openHome,openSettings, openInbox, openCreated, openParticipated } from '../../../../actions/navAction'
const MobNav =  (props) => {
    const {page} = props;
    const openHome =()=> {
       
        if (!(window.location.pathname).includes('application') && !(window.location.pathname).includes('share')){
            if(page === config.VISIT_PROFILE_PAGE) 
                props.openHome()
            else
                window.open(config.react_url + '/application', '_self')
        }
         
        else {
        if ((window.location.pathname).includes('share'))
            window.open(config.react_url + '/application', '_self')
          else
            props.openHome()
        }
      }
    const divStyle={
        textAlign:"center",
        borderStyle:"solid",
        borderTopStyle:"none",
        borderWidth:"0.5px",
        borderColor:"#eee",
    }
  return (
    
    <div style={{
        height:"45px",
        display:"grid",
        gridTemplateColumns:"25% 25% 25% 25%",
        width:"100%",
        position:"fixed",
        bottom:"0px",
        borderStyle:"solid",
        borderWidth:"0.5px",
        borderColor:"#eee",
        backgroundColor:"white",
        zIndex:"5000"
    }}>
        <div style={divStyle} onClick={openHome}>
            <img src={require('../../../images/logo5.png')}width="25px" height="25px" alt="logo" style={{margin:"auto",marginTop:"5px"}}></img>
        </div>
        <div  style={divStyle}  onClick={page===config.HOME_PAGE?props.openInbox:null}>
            <FiPhone style={{fontSize:"20px",margin:"auto",marginTop:"5px",color:(page==="home")?((props.Created)?"#40a8ac":"black"):"#ddd"}} />
            
            </div>
            <div  style={divStyle} onClick={(page===config.HOME_PAGE||page===config.VISIT_PROFILE_PAGE)?props.openCreated:null}>
            <FiMail style={{fontSize:"20px",margin:"auto",marginTop:"5px",color:(page==="home"||page==="visitProfile")?((props.Created)?"#40a8ac":"black"):"#ddd"}} />
            
            </div>
            <div  style={divStyle}>
            <FiSettings  onClick={props.openSettings}style={{fontSize:"20px",margin:"auto",marginTop:"5px",color:(props.Setting)?"#40a8ac":"black"}} />
            </div>
      
    </div>

  
  )
}


const mapStateToProps = state => ({
    Home: state.nav.openHome,
    Created: state.nav.openCreated,
    inbox: state.nav.openInbox,
    Participated: state.nav.openParticipated,
    Setting :state.nav.openSetting

})
export default connect(mapStateToProps, {openHome, openSettings,openInbox, openCreated, openParticipated})(MobNav)


