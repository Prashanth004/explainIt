import React, { Component } from 'react'
import TweetToRefer from './tweetToRefer';

export default class ReferrByTweet extends Component {
    constructor(props){
        super(props);
        this.state={tweet:false};
        this.changeTweetState = this.changeTweetState.bind(this);
    }
    changeTweetState(){this.setState({tweet:true})}
  render() {
    return (!this.state.tweet)?(<div>
          <p>User not on explain</p>
          <p>You can refer by tweet.</p>
          <button className="buttonLight" onClick={this.changeTweetState}>Tweet</button>
          <button className="buttonDark">Not now</button>
      </div>):( <div>
                <TweetToRefer questionProject={this.props.questionProject} />
            </div> )
  }
}

// const mapStateToProps = (state)=>{
// return{
//   VisitorId :state.visitProfile.id
// }
// }

// export default connect(mapStateToProps, {})(Refer);

