import React, { Component } from 'react'
import { connect } from 'react-redux';
import config from '../../../../config/config'
import { getProfileDetails } from '../../../../actions/profileAction'
import PropType from 'prop-types';

class GetProfile extends Component {

  componentDidMount() {
    this.props.getProfileDetails(this.props.userid, config.SELF)
  }
  render() {
    return (
      <div>

      </div>
    )
  }
}
GetProfile.PropType = {
  getProfileDetails: PropType.func.isRequired
};
const mapStateToProps = state => ({

})
export default connect(mapStateToProps, {
  getProfileDetails
})(GetProfile)

