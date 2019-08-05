
import { connect } from 'react-redux';
import FromActivityMainEle from './from/fromActivityMainEle'
import EmptyAvtivity from './emptyActivity'
import ToActivityMainEle from './to/ToActivityMainEle';
import FromReferral from './referral/fromRef';
import ToReferral from './referral/toRef'

import React, { Component } from 'react'

class activityRoot extends Component {
  constructor(props) {
    super(props)
    this.state = { allActivities: [] }
  }
  componentWillMount(){
    const {referrals,activities} = this.props;
    const allacti =  referrals.concat(activities);
    allacti.sort(function compare(a, b) {
      var dateA = new Date(a.time);
      var dateB = new Date(b.time);
      return dateB-dateA ;
    });
    this.setState({allActivities : allacti})
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.newActivity){
      this.state.allActivities.unshift(nextProps.newActivity);
    }
    else{
      console.log("i am not working!!!!!!!!!!!!!!!!!!")
    } 
  }
  render() {
  
    const { userId } = this.props;
    const {allActivities} = this.state;
    const activitiesEle = (allActivities).map((activity, index) =>
      (activity.activity)?
      ((activity.fromuser === userId) ? (<FromActivityMainEle key={index + 1450} activity={activity} />) : (<ToActivityMainEle key={index + 1450} activity={activity} />))
      :(activity.referrer === userId)?(<FromReferral key={index + 1450} referralAct={activity}  />):(<ToReferral key={index + 1450} referralAct={activity} />))

    return ((allActivities).length !== 0 ) ? (
      <div>
        {activitiesEle}
      </div>
    ) : (<EmptyAvtivity />)
  }
}

const mapStateToProps = function (state) {
  return {
    activities: state.call.activities,
    userId: state.auth.id,
    referrals:state.referral.referrals,
    newActivity:state.call.newActivity
  }
}

export default connect(mapStateToProps)(activityRoot);
