import React, { Component } from 'react'
import ReactModal from 'react-modal';
import './testModal.css';
import ExplainPage from './ExplainPage';
import Split from 'react-split';
import Dummy from './dummy1';
import Draggable from 'react-draggable';

  ReactModal.setAppElement('#root')
export default class componentName extends Component {
    constructor () {
        super();
        this.state = {
          showModal: false
        };
        
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
      }

        
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  render() {
    return (
        <div>
             <Split sizes={[5, 5]}>
       <Dummy />
</Split>
<Draggable>
  <div>I can now be moved around!</div>
</Draggable>
          <button onClick={this.handleOpenModal}>Trigger Modal</button>
          <p>test paragragh</p>
          <p>ksnjdvd</p>
          <h1>asjkdjfbhd</h1>
          <ReactModal 
             isOpen={this.state.showModal}
             contentLabel="Minimal Modal Example"
             className="Modal"
             overlayClassName="Overlay"
          >
          <ExplainPage />
            {/* <button onClick={this.handleCloseModal}>Close Modal</button> */}
          </ReactModal>
        </div>
      );
  }
}
