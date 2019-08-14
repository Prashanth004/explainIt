import React, { Component } from 'react'
import { connect } from 'react-redux';
import { clickAction, changeTwiiterHandle } from '../../../../actions/landingAction';
import { getProfileByTwitterHandle } from '../../../../actions/visitProfileAction';
import ReferWithTweet from './referWithTweet';
import '../../../css/explainit.css';
import { FiUser } from "react-icons/fi";
import {saveReferral, toggleContactsDisplay, selfReferAct, alreadyExplainedAct, alreadyReferredAct, startTestTwitterHandle,
    updateTwitterHandleInput
} from '../../../../actions/referral'
import './refer.css'
import { getRecpientId } from '../../../../actions/twitterApiAction'

class Refer extends Component {
    constructor(props) {
        super(props);
        this.state = { viaContacts: false, contactId:null };
        this.clickFunction = this.clickFunction.bind(this);
        this.validateTwitterHandle = this.validateTwitterHandle.bind(this);
        this.validateCondition = this.validateCondition.bind(this);
    }
    componentWillReceiveProps (nextProps){
        const {doneFetching,fetchProfile,twitterHandleValid,isPresentInExplain,startToFetchTwitterId} = nextProps;
        if(nextProps.doneFetching || nextProps.fetchProfile || nextProps.twitterHandleValid){
            console.log("doneFetching, fetchProfile, twitterHandleValid, isPresentInExplain",doneFetching, fetchProfile, twitterHandleValid, isPresentInExplain)
            if (doneFetching && fetchProfile && twitterHandleValid && startToFetchTwitterId)
                if(isPresentInExplain)
                    this.validateCondition();
        }
    }
    validateCondition(conatct,contactId) {
      
        const { twitterHandleValue } = this.props;
        // this.setState({ validatesInfo: true });

            if(conatct)
                this.props.saveReferral(this.props.questionProject.id, this.props.id, twitterHandleValue, contactId, this.props.questionProject.issueid);
           else{
            this.props.saveReferral(this.props.questionProject.id, this.props.id, twitterHandleValue, this.props.VisitorId, this.props.questionProject.issueid);
        
    }

        

    }
    validateTwitterHandle() {
        const { selfReferAct, twitterHandleValue, alreadyExplainedAct, alreadyReferredAct,startTestTwitterHandle, getProfileByTwitterHandle, getRecpientId  } = this.props;
        startTestTwitterHandle();
        if ((twitterHandleValue).toUpperCase() === this.props.twitterHandle.toUpperCase()) {
            selfReferAct();
        }
        else if (this.props.questioProjectArray.find(project => project.twitterhandle.toUpperCase() === twitterHandleValue.toUpperCase())) {
            alreadyExplainedAct();
        }
        else if (this.props.referrals.find(referal => (referal.referreetwitter.toUpperCase() === twitterHandleValue.toUpperCase() && referal.issue === this.props.questionProject.issueid))) {
            alreadyReferredAct();
        }
        else if (this.props.mycontacts.find(data => data.twitterhandle === twitterHandleValue)) {
            const contactId = this.props.mycontacts.filter(data=> data.twitterhandle === twitterHandleValue);
            console.log("constactid : ",contactId[0].contactid);
            this.setState({viaContacts:true,contactId:contactId[0].contactid})
            this.validateCondition(true,contactId[0].contactid);
        }
        else if((twitterHandleValue).toUpperCase() === this.props.twitterHandle.toUpperCase()){
            this.validateCondition(false,null);
        }
        else {
            getProfileByTwitterHandle(twitterHandleValue)
            getRecpientId(twitterHandleValue, this.props.id)
        }
    }


    clickFunction() {
        const { twitterHandleValue, clickAction, getProfileByTwitterHandle } = this.props
        if (twitterHandleValue.includes("@")) {
            // props.getRecpientId(props.twitterHandleValue.replace("@",""), this.props.id)
            clickAction(twitterHandleValue.replace("@", ""), "referr")
            getProfileByTwitterHandle(twitterHandleValue.replace("@", ""))
        }
        else {
            clickAction(twitterHandleValue, "referr")
            getProfileByTwitterHandle(twitterHandleValue)
        }
    }
    render() {
        const { saveSuccessFull, doneFetching, twitterHandleValid,isPresentInExplain,
            fetchProfile, showContactList, startToFetchTwitterId, mycontacts, selfRefer, alreadyEpxlained, alreadyReferred, updateTwitterHandleInput, twitterHandleValue, toggleContactsDisplay } = this.props;
       
            const inValidMessage = (startToFetchTwitterId && fetchProfile && doneFetching) ? ((!twitterHandleValid || selfRefer || alreadyEpxlained || alreadyReferred) ?
            (!twitterHandleValid ? (<p>Invalid TwitterHandle</p>) :
                (selfRefer ? (<p>You cant refer yourself</p>) :
                    (alreadyEpxlained ? (<p>This person has already explained.</p>) :
                        (alreadyReferred ? (<p>You have already referred this person</p>) : (null))))) : (null)) :
            (startToFetchTwitterId?((selfRefer ? (<p>You cant refer yourself</p>) :
                (alreadyEpxlained ? (<p>This person has already explained.</p>) :
                    (alreadyReferred ? (<p>You have already referred this person</p>) : (<p>Validating Twitter handle</p>))))):(null)
                    );

        
        const contacts =  (mycontacts.length !== 0 ? ((mycontacts).map(contacts => (
            <div onClick={() => { updateTwitterHandleInput(contacts.twitterhandle); toggleContactsDisplay() }} className="cont">
               <div ><img className="contactDrop" src={contacts.profilepic} alt="Pic"/></div>
               <div> <p>{contacts.username}</p></div>
               
            </div>))) : (null))
        const contactDivision = showContactList?(<div className="referContactContain">  {contacts}</div>):(null)


        return !saveSuccessFull ? ( fetchProfile && twitterHandleValid && !isPresentInExplain?
            (<div className="formContainerExplain"><ReferWithTweet  questionProject={this.props.questionProject} /></div>):(
            <div className="formContainerExplain">
                <span className="hint--top" aria-label="Contacts!">
           <FiUser onClick={toggleContactsDisplay} /></span><input className="referInput"value={twitterHandleValue} onChange={(e) => updateTwitterHandleInput(e.target.value)} placeholder="Enter @User Name"></input> 
            <button className="buttonLight" onClick={this.validateTwitterHandle}>Refer</button>
          
            {contactDivision}
           
            <br />
            {inValidMessage}
            <br />
            <br />
        </div>
       )) : (<div className="formContainerExplain"><p>Refer Successfull!</p></div>)
    }
}

const mapStateToProps = function (state) {
    return {
        isPresent: state.visitProfile.isPresent,
        id: state.auth.id,
        mycontacts: state.contact.mycontacts,
        saveSuccessFull: state.referral.saveSuccessFull,
        twitterHandle: state.auth.twitterHandle,
        referrals: state.referral.referrals,
        twitterHandleValue: state.referral.twitterHandleValue,
        alreadyEpxlained: state.referral.alreadyEpxlained,
        alreadyReferred: state.referral.alreadyReferred,
        selfRefer: state.referral.selfRefer,
        startToFetchTwitterId: state.referral.startToFetchTwitterId,
        showContactList: state.referral.showContactList,
        twitterHandleValid: state.twitterApi.profilePresent,
        doneFetching: state.twitterApi.doneFetching,
        fetchProfile: state.visitProfile.fetchProfile,
        VisitorId :state.visitProfile.id,
        isPresentInExplain: state.visitProfile.isPresent,
    }
}

export default connect(mapStateToProps, {
    clickAction, updateTwitterHandleInput,
    getProfileByTwitterHandle, getRecpientId, saveReferral, toggleContactsDisplay,
    changeTwiiterHandle, selfReferAct, alreadyExplainedAct, alreadyReferredAct, startTestTwitterHandle
})(Refer);



