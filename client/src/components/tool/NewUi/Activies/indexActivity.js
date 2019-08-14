
import { connect } from 'react-redux';
import FromActivityMainEle from './from/fromActivityMainEle'
import EmptyAvtivity from './emptyActivity'
import ToActivityMainEle from './to/ToActivityMainEle';
import FromReferral from './referral/fromRef';
import ToReferral from './referral/toRef';
import { loadMoreActivities } from '../../../../actions/callAction'
// import Loading from '../container/lodingSmall'
import Notion from './notion'

import React, { Component } from 'react'

class activityRoot extends Component {
  constructor(props) {
    super(props)
    this.state = { allActivities: [] };
    this.handleScroll = this.handleScroll.bind(this)
  }
  componentWillMount() {
    const { activities } = this.props;
    this.setState({ allActivities: activities.slice(0, (this.props.numberOfLoadMore * 15) + 15) })
  }
  componentDidMount() {

    window.addEventListener('scroll', this.handleScroll);

  }
  handleScroll() {
    const { nunerOfScrollLimit, numberOfLoadMore, loadMoreActivities } = this.props;
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (numberOfLoadMore < nunerOfScrollLimit && nunerOfScrollLimit > 0)
        setTimeout(() => {
          loadMoreActivities();
        }, 500)

    }
    // const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    // if (bottom) 


  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.newActivity) {
      const newSctList = this.state.allActivities.unshift(nextProps.newActivity);
      this.setState({ allActivities: newSctList })
    }
    if (nextProps.activeTen) {
      const newArray = (this.state.allActivities).concat(nextProps.activeTen)
      this.setState({ allActivities: newArray })
    }
    else {
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  render() {

    const { userId, numberOfLoadMore, nunerOfScrollLimit } = this.props;
    const { allActivities } = this.state;
    const activitiesEle = allActivities.length > 0 ? ((allActivities).map((activity, index) =>
      (activity.activity) ?
        ((activity.fromuser === userId) ? (<FromActivityMainEle key={index + 1450} activity={activity} />) : (<ToActivityMainEle key={index + 1450} activity={activity} />))
        : (activity.referrer === userId) ? (<FromReferral key={index + 1450} referralAct={activity} />) : (<ToReferral key={index + 1450} referralAct={activity} />))) : (null);
    const loadMore = (numberOfLoadMore < nunerOfScrollLimit && nunerOfScrollLimit > 0) ? (
      <div syle={{ margin: "10px" }}><p>Loading..</p>
      </div>) : (null)

    return ((allActivities).length !== 0) ? (
      <div className="activitiesWithSymbols" onScroll={this.handleScroll} >

        <div ><Notion /></div>
        <div style={{textAlign:"center"}}>
          {activitiesEle}
          {loadMore}
        </div>


        {/* <button className="buttonDark" onClick={loadMoreActivities}>Load more</button> */}
      </div>
    ) : (<EmptyAvtivity />)
  }
}

const mapStateToProps = function (state) {
  return {
    activeTen: state.call.activeTen,
    activities: state.call.activities,
    userId: state.auth.id,
    referrals: state.referral.referrals,
    newActivity: state.call.newActivity,
    nunerOfScrollLimit: state.call.nunerOfScrollLimit,
    numberOfLoadMore: state.call.numberOfLoadMore

  }
}

export default connect(mapStateToProps, { loadMoreActivities })(activityRoot);
