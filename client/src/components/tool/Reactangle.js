import React from 'react';

import {Rect} from 'react-konva';

class Rectangle extends React.Component {
  render() {
    return (
      <Rect
      x={this.props.x}
      y={this.props.y}
      width={this.props.width}
      height={this.props.height}
      rotation={this.props.rotation}
      scaleX={this.props.scaleX}
      scaleY = {this.props.scaleY}
    cornerRadius={this.props.connerRadius}
    stroke
    strokeWidth= {this.props.strokeWidth}
      name={this.props.name}
      draggable={this.props.draggable}
      fill={this.props.fill}
      onDragEnd={this.props.onDragEnd1}
      />
    );
  }
}

export default Rectangle;