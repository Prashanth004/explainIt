import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/shapes.css';

class Shapes extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    render() {
        return (

                <div className="shapes">
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addrect}
                            draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/rect1.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addcrc}
                             draggable={true} height="90%" width="90%" object-fit="contain"  src={require("../images/circle.jpg")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addRightArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/rightArrow.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addLefttArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/leftArrow.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addRigUpArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/arrowRigUp.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addRigBotArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/arrowRigBot.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img  onClick={this.props.addDiamond}
                             draggable={true} height="90%" width="90%" object-fit="contain" alt="diamond" src={require("../images/diamond.png")}></img>
                    </div>
                  
                    
                    <div className="imagesShapes">
                        <img onClick={this.props.addTriangle}
                             draggable={true} height="90%" width="90%" object-fit="contain" alt="triangle" src={require("../images/triangle.png")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img alt="shapes" onClick={this.props.addRountRect}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/rountRect.PNG")}></img>
                    </div>
                    
                    <div className="imagesShapes">
                        <img  onClick={this.props.addElipse}
                             draggable={true} height="90%" width="90%" object-fit="contain" alt="elipse" src={require("../images/elipse.jpg")}></img>
                    </div>
                   

                    <div className="imagesShapes">
                    <span className="hint--top" aria-label="Write content below and then click me">
                        <img alt="shapes" onClick={this.props.addText}
                        onDoubleClick ={this.props.test}
                             draggable={true} height="100%" width="100%" object-fit="contain"  src={require("../images/text.PNG")}></img>
                    </span>
                        <input type="text" onChange={this.props.handleText} placeholder="write" className="textInputTool"  />
                    </div>

                </div>

           
        )
    }
}

export default Shapes;