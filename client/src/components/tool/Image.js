import React from 'react';
import { Image } from 'react-konva';


class Images extends React.Component {
    render() {
        return (
            <Image
                x={this.props.x}
                y={this.props.y}
                scaleX = {this.props.scaleX}
                scaleY = {this.props.scaleY}
                width={this.props.width}
                height={this.props.height}
               
              image={this.props.image}
            //   imageSrc={this.stateimageSrc}
            
              crossOrigin = {this.props.crossOrigin}
                name={this.props.name}
                draggable={this.props.draggable}
                onDragEnd={this.props.onDragEnd1}
            />
        );
    }
}

export default Images;