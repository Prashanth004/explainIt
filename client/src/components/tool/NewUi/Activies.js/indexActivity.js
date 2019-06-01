import React from 'react'
import { connect } from 'react-redux';
import CallSuccess  from './CallSuccess';
import CallFail from './CallFailed';
import Message from './Message';
import EmptyAvtivity from './emptyActivity'
import config from '../../../../config/config'

const activityRoot= (props) => {
const activities = (props.activities).map((activity,index)=>(
    (activity.activity===config.CALL_FAILED)?(<CallFail key={index+1050} activity={activity}/>):
    (activity.activity===config.CALL_SUCCESSFULL)?(<CallSuccess key={index+1350} activity={activity} />):
    (<Message key={index+1450} activity={activity}/>)
))
  return ((props.activities).length!==0)?(
    <div>
      {activities}
    </div>
  ):(<EmptyAvtivity />)
}
const mapStateToProps = function(state) {
    return {
    activities:state.call.activities
    }
  }
  
  export default connect(mapStateToProps)(activityRoot);
