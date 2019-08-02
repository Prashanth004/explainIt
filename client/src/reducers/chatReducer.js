import {RECEIVER_INITIAL_REPLY_AGREE,RECEIVER_INITIAL_REPLY_SCHEDULE,
    RECEIVER_INITIAL_REPLY_SEND_RECORD,RECEIVER_FINAL_AGREE,INITIATOR_REJECT_REPLY,
    INITIATOR_HI,CHOOSE_SHEDULE,INITIATOR_CHOOSE_SCHEDULE,SET_SHEDULE} from '../actions/types';



    const initialState = {
        intiatorHi:false,
        receieverInitialSendRecord:false,
        receiverInitialShedule:false,
        receiverInitialAgree:false,
        initiatorAgree :false,
        initiatorConfirmShedule:false,
        recieverFinalAgree:false,
        noOfslots:1,
        slotsArray : [],
        finalSlot:{}
    }
    export default function(state = initialState, action){
        switch(action.type){
        case RECEIVER_INITIAL_REPLY_AGREE:
            return{
                ...state,
                receiverInitialAgree:true
            }
        case RECEIVER_INITIAL_REPLY_SCHEDULE:
            return{
                ...state,
                receiverInitialShedule:true,
                noOfslots:action.noOfSlots,
                slotsArray : action.slotsArray
            }
        case RECEIVER_INITIAL_REPLY_SEND_RECORD:
                return{
                    ...state,
                    receieverInitialSendRecord:true
                
                }
        case RECEIVER_FINAL_AGREE:
                return{
                    ...state,
                    recieverFinalAgree:true
                
                }
            case INITIATOR_REJECT_REPLY:
                return{
                    ...state,
                
                }
            case INITIATOR_HI:
                return{
                    ...state,
                    intiatorHi:true
                
                }
            case CHOOSE_SHEDULE:
                   const finalslot =  state.slotsArray.filter(schedule=>schedule.id === action.slotid)
                return{
                    ...state,
                    finalSlot:finalslot
                
                }
            case INITIATOR_CHOOSE_SCHEDULE:
                const finalslot2 =  state.slotsArray.filter(schedule=>schedule.id === action.slotid)
                return{
                    ...state,
                    finalSlot:finalslot2,
                  
                
                }
            case SET_SHEDULE:
                return{
                    ...state,
                    finalSlot:action.schedule
                }
             

        default:
            return{
                ...state
            }
    }

    }

