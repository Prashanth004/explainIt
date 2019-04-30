import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stillAuthenicated } from '../../../../actions/signinAction';
import DisplayIssues from './created'

import PropType from 'prop-types';

class savedIssues extends Component {
    componentWillMount() {
        this.props.stillAuthenicated()
    }

    render() {
        var cardsComponent=(this.props.stillAuthenicated && this.props.userId!== null)?(
            <DisplayIssues 
            userId ={this.props.userId}/>
        ):(null)
        return (
            <div>
                {cardsComponent}
            </div>
        )
    }
}
savedIssues.PropType = {
    stillAuthenicated:PropType.func.isRequired,
   

};
const mapStateToProps = state => ({
    isAauthenticated: state.auth.isAuthenticated,
    userId: state.auth.id,
    
})
export default connect(mapStateToProps, {
    stillAuthenicated
})(savedIssues)
