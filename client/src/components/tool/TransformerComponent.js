import React from 'react';

import {  Transformer } from 'react-konva';
import 'bootstrap/dist/css/bootstrap.min.css';
class TransformerComponent extends React.Component {

  constructor(props){
    super(props)
  }

    componentDidMount() {
      this.checkNode();
    }
    componentDidUpdate() {
      this.checkNode();
    }
    checkNode() {
      // here we need to manually attach or detach Transformer node
      const stage = this.transformer.getStage();
      const { selectedShapeName } = this.props;
     
      const selectedNode = stage.findOne('.' + selectedShapeName);
    
      // do nothing if selected node is already attached
      if (selectedNode === this.transformer.node()) {
        return;
      }
  
      if (selectedNode) {
      
        this.transformer.attachTo(selectedNode);
        selectedNode.on('transformstart', function () {
          
        });
        var state = this
        selectedNode.on('transformend', function () {
         state.props.updateWH(selectedNode)
        });
      } else {
        // remove transformer
        this.transformer.detach();
      }
      this.transformer.getLayer().batchDraw();
    }
    render() {
      return (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
         
        />
      );
    }
  }

export default TransformerComponent