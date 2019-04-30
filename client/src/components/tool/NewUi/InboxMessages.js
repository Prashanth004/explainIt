import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {changeReadStatus} from '../../../actions/messageAction'
class InboxMessage extends Component {
  
    componentWillMount() {
        this.props.changeReadStatus(this.props.message.id)
    }
    render() {
        return (
            <div>
                <div className="messageElementDiv">
                    <div >
                       
                    </div>
                    <div className="nameDate">
                  
                            <img alt="profile pic of messaged"className="profileImageElementInbox" src={this.props.message.profilepic} />
                       
                        <p className="timeDate">{this.props.message.time.slice(0, 15)}</p>
                        {/* <span>From :</span> */}
                        {/* <br/> */}
                        <span className="formName"><b>
                            {this.props.message.username}
                        </b>
                        </span>
                        <br/>
                        <span className="headers">Subject :</span>
                        <br/>
                        {/* <div className="inboxContent"> */}
                        <span className="inboxContent">{this.props.message.subject}</span>
                        {/* </div> */}
                        <br/>
                        <span className="headers">Link to recording :</span>
                        <br/>
                        
                        <div className="linkToProject">
                            <a href={this.props.message.link}  rel="noopener noreferrer" target="_blank">{this.props.message.link}</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
InboxMessage.PropType = {
    changeReadStatus:PropType.func.isRequired
};
const mapStateToProps = state => ({


})
export default connect(mapStateToProps, {changeReadStatus})(InboxMessage)



