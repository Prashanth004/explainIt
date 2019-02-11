import React from 'react';
import { Circle } from 'react-konva';

class Circles extends React.Component {
    render() {
        return (
            <Circle
                x={this.props.x}
                y={this.props.y}
                radius={this.props.radius}
                rotation={this.props.rotation}
                scaleX= {this.props.scaleX}
                scaleY = {this.props.scaleY}

                stroke
                strokeWidth= {this.props.strokeWidth}
                name={this.props.name}
                draggable={this.props.draggable}
                onDragEnd={this.props.onDragEnd1}
            />
        );
    }
}

export default Circles;