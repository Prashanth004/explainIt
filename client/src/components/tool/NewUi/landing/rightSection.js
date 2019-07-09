


import React, { Component } from 'react'
import LogoContainer from './logoContainer'
import './landing.css'
import ExplinerVideoModal from '../container/explainerModal';
import ExtCloseBtn from '../container/modalExtButton'
import { Modal} from 'reactstrap';

import Signin from './signin'

export default class componentName extends Component {
  constructor(props){
    super(props)
    this.state={showExplainerVideo:false}
    this.toggleExplainerVideo = this.toggleExplainerVideo.bind(this);
  }
  toggleExplainerVideo(){this.setState({showExplainerVideo:!this.state.showExplainerVideo})}
  render() {
    return (   
    <div className="onboardSection">
      <LogoContainer />
      <br />
      <br/>
      {/* <div> */}
        <button onClick={this.toggleExplainerVideo}className="buttonDark HomeHowitworksButton">How it works</button>
      {/* </div> */}
      <br />
      <br />
      <br/>
      <div>
        <h6>Alright then, tell us if you are interested and if we can notify you to test out our app
</h6>
        <br />
        <br/>
        {/* <Form /> */}
       
        <Signin />
        <Modal  size='lg' centered ={true} isOpen={this.state.showExplainerVideo} toggle={this.toggleExplainerVideo} external={<ExtCloseBtn toggle={this.toggleExplainerVideo}/>}>
                      <ExplinerVideoModal />
              </Modal>
      </div>

   


  </div>)
  }
}

