import React from 'react';
import { Text } from 'react-konva';

class Texts extends React.Component {
    render() {
        return (
            <Text
               
              

                text={this.props.text}
                x={this.props.x}
                y={this.props.y}
                fontSize = {this.props.fontSize}

               
                name={this.props.name}
                draggable
                onDragEnd={this.props.onDragEnd1}
               
            />
        );  
    }
}

export default Texts;