import {RECEIVER_INITIAL_REPLY_AGREE,RECEIVER_INITIAL_REPLY_SCHEDULE,
    RECEIVER_INITIAL_REPLY_SEND_RECORD,RECEIVER_FINAL_AGREE,INITIATOR_REJECT_REPLY,
    INITIATOR_HI,CHOOSE_SHEDULE,INITIATOR_CHOOSE_SCHEDULE,SET_SHEDULE} from './types'

export const receiverInitialAgreeAct = () =>dispatch=>{
    dispatch({
        type:RECEIVER_INITIAL_REPLY_AGREE
    })
}

export const receiverInitialReplyScheduleAct = (noOfSlots,slotsArray) =>dispatch=>{
    dispatch({
        type:RECEIVER_INITIAL_REPLY_SCHEDULE,
        noOfSlots : noOfSlots,
        slotsArray:slotsArray
    })
    
}
export const receiverInitialSendRecordMessageAct = () =>dispatch=>{
    dispatch({
        type:RECEIVER_INITIAL_REPLY_SEND_RECORD,

    })
    
}
export const receiverFinalAgreeAct = () =>dispatch=>{
    dispatch({type : RECEIVER_FINAL_AGREE})
    
}
export const initiatorHiAct = ()=>dispatch=>{
    dispatch({
        type:INITIATOR_HI
    })
}


export const initiatorChooseSchedule = (slotid)=>dispatch=>{
    dispatch({
        type:INITIATOR_CHOOSE_SCHEDULE,
        slotid:slotid
    })
}

export const initiatorRejectReply = ()=>dispatch=>{
    dispatch({
        type:INITIATOR_REJECT_REPLY
    })
}

export const setShecdule = (schedule)=>(dispatch)=>{
    dispatch({
        type:SET_SHEDULE,
        schedule:schedule
    })

}
export const chooseShedule = (slotid)=>(dispatch)=>{
    dispatch({
        type:CHOOSE_SHEDULE,
        slotid:slotid
    })
}
