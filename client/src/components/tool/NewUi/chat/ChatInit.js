import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import "react-datepicker/dist/react-datepicker.css";
import utils from './utils'
import {receiverInitialAgreeAct, receiverInitialReplyScheduleAct, receiverInitialSendRecordMessageAct,
  receiverFinalAgreeAct, initiatorHiAct, initiatorChooseSchedule, initiatorRejectReply, chooseShedule
} from '../../../../actions/chatAction'
class ChatInit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      recieverId: "1090895508699176960",
    };
    this.handleChange = this.handleChange.bind(this);
    this.chooseShedule = this.chooseShedule.bind(this);
    this.agree = this.agree.bind(this);
  }
  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
  agree(){
    this.setState({

    })
  }
  chooseShedule(e){
    const { socket,initiatorChooseSchedule } = this.props;
    const { recieverId } = this.state;
    initiatorChooseSchedule(e.target.value);
    socket.emit('chat',{
      'role':utils.RECEIVER,
      'recieverId' : recieverId,
      'type':utils.INITIATOR_SEND_ACK_SCHEDULE,
      'payload':{
        'slotId' : e.target.value
      }
    })
  }
  componentDidMount() {
    const recieverId = this.state;
    const {socket, profileid,receiverInitialAgreeAct,receiverInitialReplyScheduleAct,
    receiverInitialSendRecordMessageAct,initiatorHiAct } = this.props;
    initiatorHiAct();
    socket.emit('chat',{
      'role':utils.RECEIVER,
      'recieverId' : recieverId,
      'type':utils.INITIATOR_HI,
      'payload':{ }
    })
    socket.on('chat', (data) => {
      if (data.role === utils.INITIATOR) {
        if (data.uerid === profileid) {
          switch (data.message) {
            case utils.RECEIVER_INITIALREPLY_AGREE:
              receiverInitialAgreeAct();
              break;
            case utils.RECEIVER_INITIALREPLT_SCHEDULE:
              receiverInitialReplyScheduleAct();
              break;
            case utils.RECEIVER_INITIAL_REPLY_SEND_RECORD:
              receiverInitialSendRecordMessageAct();
              break;
            case utils.RECEIVER_FINAL_AGREE:
              receiverFinalAgreeAct();
              break;
            default:
              console.log("unknown category");
              break;
          };
        }
      }
    })
  }
  render() {
    return (
      <div>
        <button >Start</button>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          timeCaption="time"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAauthenticated: state.chat.isAuthenticated,
  profileid: state.chat.id,
  intiatorHi:state.chat.intiatorHi,
  receieverInitialSendRecord:state.chat.receieverInitialSendRecord,
  receiverInitialShedule:state.chat.receiverInitialShedule,
  receiverInitialAgree:state.chat.receiverInitialAgree,
  initiatorAgree :state.chat.initiatorAgree,
  initiatorConfirmShedule:state.chat.initiatorConfirmShedule,
  recieverFinalAgree:state.chat.recieverFinalAgree,
  noOfslots:state.chat.noOfslots,
  slotsArray : state.chat.slotsArray,
  finalSlot:state.chat.finalSlot
})

export default connect(mapStateToProps, {
  receiverInitialAgreeAct, receiverInitialReplyScheduleAct, receiverInitialSendRecordMessageAct,
  receiverFinalAgreeAct, initiatorHiAct, initiatorChooseSchedule, initiatorRejectReply, chooseShedule
})(ChatInit)