import React from 'react';

import {RegularPolygon} from 'react-konva';

class Rectangle extends React.Component {
  render() {
    return (
      <RegularPolygon
      sides={this.props.sides}
      radius={this.props.radius}
      x={this.props.x}
      y={this.props.y}
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