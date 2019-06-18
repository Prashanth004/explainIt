
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
    //merge array
    const {referrals,activities} = this.props;
    const allacti =  referrals.concat(activities);

    //sort affaray 
    allacti.sort(function compare(a, b) {
      var dateA = new Date(a.time);
      var dateB = new Date(b.time);
      return dateB-dateA ;
    });

   console.log("all acti sorted : ",allacti)
    // assign it to all activities
    this.setState({allActivities : allacti})
  }
  render() {
    const { userId, activities } = this.props;
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
    referrals:state.referral.referrals
  }
}

export default connect(mapStateToProps)(activityRoot);
