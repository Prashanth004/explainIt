import React from 'react';
import { Arrow } from 'react-konva';

class Arrows extends React.Component {
    render() {
        return (
            <Arrow
                x={this.props.x}
                y={this.props.y}
        
                scaleX ={this.props.scaleX}
                scaleY ={this.props.scaleY}
                rotation = {this.props.rotation}

                points={this.props.points}

                stroke
                // strokeWidth= {this.props.strokeWidth}
                strokeWidth ={this.props.strokeWidth}
                name={this.props.name}
                draggable={this.props.draggable}
                onDragEnd={this.props.onDragEnd1}
                fill={"black"}

            />
        );  
    }
}

export default Arrows;