import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import {changeReadStatus} from '../../../actions/messageAction'
class InboxMessage extends Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        this.props.changeReadStatus(this.props.message.id)
    }
    render() {
        return (
            <div>
                <div className="messageElementDiv">
                    <div >
                        <div className="profileImageInbox">
                            <img className="profileImageElementInbox" src={this.props.message.profilepic} />
                        </div>
                    </div>
                    <div className="nameDate">
                        <p className="timeDate">{this.props.message.time.slice(0, 15)}</p>
                        <span><b>
                            {this.props.message.username}
                        </b>
                        </span>
                        <br/>
                        <span>{this.props.message.subject}</span>
                        <div className="linkToProject">
                            <a href={this.props.message.link} target="_blank">{this.props.message.link}</a>
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



