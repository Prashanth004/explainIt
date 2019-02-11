import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/shapes.css';
import { Input, Label, FormGroup, } from 'reactstrap'

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
                        <img onClick={this.props.addrect}
                            draggable={true} height="100%" width="100%" object-fit="contain" alt=" " src={require("../images/rect.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addcrc}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/circle.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addRightArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/rightArrow.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addLefttArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/leftArrow.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addRigBotArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/arrowRigBot.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addRigUpArrow}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/arrowRigUp.PNG")}></img>
                    </div>
                    <div className="imagesShapes">
                        <img onClick={this.props.addText}
                             draggable={true} height="100%" width="100%" object-fit="contain" alt="" src={require("../images/text.PNG")}></img>
                        <Input type="text" onChange={this.props.handleText} placeholder="write" className="textInput" />
                    </div>

                </div>

           
        )
    }
}

export default Shapes;