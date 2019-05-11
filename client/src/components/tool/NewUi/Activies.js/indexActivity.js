import React from 'react'
import { connect } from 'react-redux';
import CallSuccess  from './CallSuccess';
import CallFail from './CallFailed';
import Message from './Message';
import config from '../../../../config/config'

const activityRoot= (props) => {
const activities = (props.activities).reverse().map((activity,index)=>(
    (activity.activity===config.CALL_FAILED)?(<CallFail activity={activity}/>):
    (activity.activity===config.CALL_SUCCESSFULL)?(<CallSuccess activity={activity} />):
    (<Message activity={activity}/>)
))
  return (
    <div>
      {activities}
    </div>
  )
}
const mapStateToProps = function(state) {
    return {
    activities:state.call.activities
    }
  }
  
  export default connect(mapStateToProps)(activityRoot);
