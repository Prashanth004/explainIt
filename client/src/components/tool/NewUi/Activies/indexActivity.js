import React from 'react'
import { connect } from 'react-redux';
import FromActivityMainEle from './from/fromActivityMainEle'
import EmptyAvtivity from './emptyActivity'
import ToActivityMainEle from './to/ToActivityMainEle'


const activityRoot= (props) => {
const activities = (props.activities).map((activity,index)=>
  (activity.fromuser ===  props.userId)?(<FromActivityMainEle key={index+1450} activity={activity}/>):(<ToActivityMainEle key={index+1450} activity={activity}/>));

  return ((props.activities).length!==0)?(
    <div>
      {activities}
    </div>
  ):(<EmptyAvtivity />)
}
const mapStateToProps = function(state) {
    return {
    activities:state.call.activities,
    userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps)(activityRoot);
