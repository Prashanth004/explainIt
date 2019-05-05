import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Layer, Stage } from 'react-konva';
import { Button, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import '../css/form.css';
import '../css/create.css';
import Arrow from "./Arrow";
import Circle from "./Circle";
import Image from "./Image";
import Rectangle from "./Reactangle";
import Shapes from './Shapes';
import Text from './Text';
import TransformerComponent from "./TransformerComponent";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import config from '../../config/config';
import '../ErrorHnadle'





class Forms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            imgData: [],
            imageUrl: [],
            images: [],
            circles: [],
            arrows: [],
            texts: [],
            textValue: null,
            rectangles: [],
            stageHeight: 540,
            stateWidth: 720,
            imgWidth: 60,
            imgHeight: 60,
            selectedShapeName: '',
            canvasUrl: '',
            fileName: " ",
            projName: "",
            project: false,
            projectid: this.projectid

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.assignImageUrl = this.assignImageUrl.bind(this);
        this.addReact = this.addReact.bind(this);
        this.addCircle = this.addCircle.bind(this);
        this.addRightArrow = this.addRightArrow.bind(this);
        this.addLefttArrow = this.addLefttArrow.bind(this);
        this.addRigBotArrow = this.addRigBotArrow.bind(this);
        this.addRigUpArrow = this.addRigUpArrow.bind(this);
        this.addText = this.addText.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.download = this.download.bind(this);
        this.convToJsov = this.convToJsov.bind(this);
        this.handleText = this.handleText.bind(this);
        this.deleteThis = this.deleteThis.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.addReactFull = this.addReactFull.bind(this);
        this.updateWH = this.updateWH.bind(this);
        this.handleProj = this.handleProj.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.openProj = this.openProj.bind(this);
        this.newProj = this.newProj.bind(this);
    }

    handleProj(event) {
        this.setState({
            projName: event.target.value
        })
    }

    updateWH(obbj) {
        var index = null
        var shapes = obbj.className
        var name = this.state.selectedShapeName

        if (shapes === "Circle") {
            this.state.circles.map(function (circle, i) {
                if (circle.name === name) {
                    index = i;
                }
            })
            let circles = [...this.state.circles];
            let cir = { ...circles[index] };
            cir.x = obbj.x();
            cir.y = obbj.y();
            cir.scaleX = obbj.scaleX();
            cir.scaleY = obbj.scaleY();
            cir.rotation = obbj.rotation();
            cir.radius = obbj.radius();

            circles[index] = cir;
            this.setState({ circles });
        }
        if (shapes === "Rect") {
            this.state.rectangles.map(function (rectangle, i) {
                if (rectangle.name === name) {
                    index = i;
                }
            })
            let rectangles = [...this.state.rectangles];
            let rect = { ...rectangles[index] };
            rect.x = obbj.x();
            rect.width = obbj.width()
            rect.height = obbj.height()
            rect.rotation = obbj.rotation()
            rect.scaleX = obbj.scaleX()
            rect.scaleY = obbj.scaleY()
            rect.y = obbj.y();
            rectangles[index] = rect;
            this.setState({ rectangles });
        }
        if (shapes === "Arrow") {
            this.state.arrows.map(function (arrow, i) {
                if (arrow.name === name) {
                    index = i;
                }
            })
            let arrows = [...this.state.arrows];
            let arr = { ...arrows[index] };
            arr.x = obbj.x();
            arr.y = obbj.y();
            arr.width = obbj.width();
            arr.height = obbj.height();
            arr.scaleX = obbj.scaleX();
            arr.scaleY = obbj.scaleY();
            arr.rotation = obbj.rotation();
            arrows[index] = arr;
            this.setState({ arrows });
        }
        if (shapes === "Text") {
            this.state.texts.map(function (text, i) {
                if (text.name === name) {
                    index = i;
                }
            })
            let texts = [...this.state.texts];
            let txt = { ...texts[index] };
            txt.x = obbj.x();
            txt.y = obbj.y();
            txt.scaleX = obbj.scaleX();
            txt.scaleY = obbj.scaleY();
            txt.rotation = obbj.rotation();
            txt.fontSize = obbj.fontSize();
            texts[index] = txt;
            texts.width = obbj.width()
            texts.height = obbj.height()
            this.setState({ texts });
        }
        if (shapes === "Image") {
            this.state.images.map(function (image, i) {
                if (image.name === name) {
                    index = i;
                }
            })
            let images = [...this.state.images];
            let img = { ...images[index] };
            img.x = obbj.x();
            img.y = obbj.y();
            img.scaleX = obbj.scaleX();
            img.scaleY = obbj.scaleY();
            img.width = obbj.width()
            img.height = obbj.height()
            images[index] = img;

            this.setState({ images });
            console.log(this.state.images)
        }

    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    convToJsov(event) {
        const stateJson = (this.canv).toJSON();
    }
    download(event) {
        var dateNow = new Date().toString()
        const url = (this.canv).toDataURL();
        this.setState({
            canvasUrl: url,
            fileName: dateNow
        })



    }


    handleStageMouseDown = e => {
        // clicked on stage - cler selection
        if (e.target === e.target.getStage()) {
            this.setState({
                selectedShapeName: ''
            });
            return;
        }
        // clicked on transformer - do nothing
        const clickedOnTransformer =
            e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {

            return;

        }
        // find clicked rect by its name
        const name = e.target.name();
        const rect = this.state.rectangles.find(r => r.name === name);
        const cir = this.state.circles.find(c => c.name === name);
        const arr = this.state.arrows.find(a => a.name === name);
        const txt = this.state.texts.find(t => t.name === name);
        const img = this.state.images.find(i => i.name === name)
        if (rect || cir || arr || txt || img) {

            this.setState({
                selectedShapeName: name
            });

        } else {
            this.setState({
                selectedShapeName: ''
            });
        }
    };

    addRightArrow(event) {
        let lne = null
        lne = {
            x: 20,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
            name: String(Math.random()),
            points: [0, 0, 70, 0]

        }
        this.setState({
            arrows: [...this.state.arrows, lne]
        })
    }


    addLefttArrow(event) {
        let lne = null
        lne = {
            x: 20,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
            name: String(Math.random()),
            points: [0, 0, 70, 0, 1, 0]

        }
        this.setState({
            arrows: [...this.state.arrows, lne]
        })
    }
    clearAll(event) {
        this.setState({
            arrows: [],
            rectangles: [],
            circles: [],
            images: [],
            imageUrl: [],

            texts: []
        })


    }
    addRigBotArrow(event) {
        let lne = null
        lne = {
            x: 20,
            y: 200,
            draggable: true,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            name: String(Math.random()),
            points: [0, 0, 50, 0, 50, 50]

        }
        this.setState({
            arrows: [...this.state.arrows, lne]
        })
    }
    addRigUpArrow(event) {
        let lne = null
        lne = {
            x: 20,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
            name: String(Math.random()),
            points: [0, 0, 50, 0, 50, -50]

        }
        this.setState({
            arrows: [...this.state.arrows, lne]
        })
    }





    addCircle(event) {
        let crcle = null
        crcle = {
            x: 50,
            y: 50,
            rotation: 0,
            scaleX: 1,
            scaleY: 2,
            draggable: true,

            radius: 50,
            name: String(Math.random())
        }
        this.setState({
            circles: [...this.state.circles, crcle]
        })

    }
    addText(event) {
        let txt = null
        txt = {
            x: 50,
            y: 50,
            fontSize: 30,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
            text: this.state.textValue,
            name: String(Math.random())
        }
        this.setState({
            texts: [...this.state.texts, txt]
        })

    }
    componentDidMount() {
        document.addEventListener("keydown", this.deleteThis, false);

        var proID = this.props.match.params.projid
        var token = JSON.parse(localStorage.getItem("token"))
        if (proID !== null) {
            axios({
                method: 'get',
                url: config.base_dir + '/project/items/' + proID,
                headers: {
                    "Authorization": token,
                }

            }).then(response => {

                if (response.status === 200) {
                    var items = (response.data.msg.items.shapeitems.children[0].children)
                    items.map(obg => {

                        if (obg.className === "Rect") {
                            this.setState({
                                rectangles: [...this.state.rectangles, obg.attrs]

                            })
                        }
                        if (obg.className === "Circle") {
                            this.setState({
                                circles: [...this.state.circles, obg.attrs]

                            })
                        }
                        if (obg.className === "Arrow") {
                            this.setState({
                                arrows: [...this.state.arrows, obg.attrs]

                            })
                        }

                        if (obg.className === "Text") {
                            this.setState({
                                texts: [...this.state.texts, obg.attrs]
                            })
                        }
                    })

                    var images_new = response.data.msg.items.images
                   
                    images_new.map(img => {
                        let image2 = null;
                        image2 = new window.Image();
                        image2.setAttribute('crossOrigin', 'anonymous');
                        image2.src = img.imageSrc;
                        image2.width = img.width;
                        image2.height = img.height;
                        image2.name = img.name;
                        let img1 = null;
                        img1 = {
                            x: img.x,
                            y: img.y,
                            width: img.width,
                            height: img.height,
                            scaleX: img.scaleX,
                            scaleY: img.scaleY,
                            image: image2,
                            imageSrc:img.imageSrc,
                            crossOrigin: "anonymous",
                            name: img.name,
                            draggable: true
                        }
                        this.setState({
                            images: [...this.state.images, img1]
                
                        })
                
                        console.log(this.state.images)
                    })
                }

                else {
                    console.log("response " + response.data)
                }
            }).catch(err => {
                console.log("eror" + err)
            }
            )

        }
        else {
            this.addReactFull()
        }



    }

    deleteThis(event) {



        if (event.keyCode === 46) {
            var array = []
            var index = null
            if (this.state.selectedShapeName !== '') {
                const name = this.state.selectedShapeName
                const rect = this.state.rectangles.find(r => r.name === name);
                const cir = this.state.circles.find(c => c.name === name);
                const arr = this.state.arrows.find(a => a.name === name);
                const txt = this.state.texts.find(t => t.name === name);
                const img = this.state.images.find(i => i.name === name)
                if (rect) {
                    array = [...this.state.rectangles]
                    index = array.indexOf(rect)
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ rectangles: array });
                    }
                }
                else if (cir) {
                    array = [...this.state.circles]
                    index = array.indexOf(cir)
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ circles: array });
                    }
                }
                else if (arr) {
                    array = [...this.state.arrows]
                    index = array.indexOf(arr)
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ arrows: array });
                    }
                }
                else if (txt) {
                    array = [...this.state.texts]
                    index = array.indexOf(txt)
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ texts: array });
                    }
                }
                else if (img) {
                    array = [...this.state.images]
                    index = array.indexOf(img)
                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({ images: array });
                    }
                }

            }

        }

    }
    addReact(event) {
        let recto = null
        recto = {
            x: 10,
            y: 10,
            rotation: 0,
            width: 140,
            height: 60,
            scaleX: 1,
            scaleY: 1,
            fill: "white",
            draggable: true,
            connerRadius: 0,
            name: String(Math.random())
        }
        this.setState({
            rectangles: [...this.state.rectangles, recto]

        })
    }
    addReactFull() {
        let recto = null
        recto = {
            x: -5,
            y: -5,
            width: 800,
            height: 580,
            fill: "white",
            draggable: false,
            connerRadius: 0,
            name: String(Math.random())
        }
        this.setState({
            rectangles: [...this.state.rectangles, recto]

        })
    }
    handleText(event) {
        this.setState({ textValue: event.target.value });
    }

    assignImageUrl(event) {
        var rand = String(Math.random())
        let image1 = null;
        image1 = new window.Image();
        image1.setAttribute('crossOrigin', 'anonymous');
        image1.src = event.target.src;


        image1.width = this.state.imgWidth;
        image1.height = this.state.imgHeight;

        image1.name = rand;

        let img = null;
        img = {
            x: 10,
            y: 10,
            width: this.state.imgWidth,
            height: this.state.imgHeight,
            scaleX: 1,
            scaleY: 1,
            image: image1,
            imageSrc: event.target.src,
            crossOrigin: "anonymous",
            name: rand,
            draggable: true
        }
        this.setState({
            images: [...this.state.images, img]

        })
        this.setState({
            imageUrl: [...this.state.imageUrl, image1]
        })
    }


        assignImageUrl(event) {
        var rand = String(Math.random())
        let image1 = null;
        image1 = new window.Image();
        image1.setAttribute('crossOrigin', 'anonymous');
        image1.src = event.target.src;


        image1.width = this.state.imgWidth;
        image1.height = this.state.imgHeight;

        image1.name = rand;

        let img = null;
        img = {
            x: 10,
            y: 10,
            width: this.state.imgWidth,
            height: this.state.imgHeight,
            scaleX: 1,
            scaleY: 1,
            image: image1,
            imageSrc: event.target.src,
            crossOrigin: "anonymous",
            name: rand,
            draggable: true
        }
        this.setState({
            images: [...this.state.images, img]

        })
        this.setState({
            imageUrl: [...this.state.imageUrl, image1]
        })
    }
    saveImage(event) {
        var projectName = this.state.projName
        var imgData = (this.canv).toDataURL()
        var shapeitems = (this.canv).toJSON();
        var items = {
            shapeitems: JSON.parse(shapeitems),
            images: this.state.images
        }
        if (projectName === " ") {
            alert("Project Name can not be empty")
        }
        else {
            let user = JSON.parse(localStorage.getItem('token'));


            axios({
                method: 'post',
                url: config.base_dir + '/project',
                headers: {
                    "Authorization": user,
                },
                data: {
                    projectName: projectName,
                    imageData: imgData,
                }
            }).then(response => {

                if (response.status === 200) {


                    axios({
                        method: 'post',
                        url: config.base_dir + '/project/items',
                        headers: {
                            "Authorization": user,
                        },
                        data: {
                            projectName: projectName,
                            items: items,
                        }

                    }).then(response => {
                        if (response.status === 200) {
                            alert("successull")
                        }
                    })
                }

            }).catch((err) => {

                alert(err)
            })





        }
    }
    openProj(event) {
        this.setState({
            project: true
        })
    } handleDragEnd(event) {

        var index = null
        var shapes = event.target.className
        var name = this.state.selectedShapeName

        if (shapes === "Circle") {
            this.state.circles.map(function (circle, i) {
                if (circle.name === name) {
                    index = i;
                }
            })
            let circles = [...this.state.circles];
            let cir = { ...circles[index] };
            cir.x = event.target.x();
            cir.y = event.target.y();
            circles[index] = cir;
            this.setState({ circles });
        }
        if (shapes === "Rect") {
            this.state.rectangles.map(function (rectangle, i) {
                if (rectangle.name === name) {
                    index = i;
                }
            })
            let rectangles = [...this.state.rectangles];
            let rect = { ...rectangles[index] };
            rect.x = event.target.x();
            rect.y = event.target.y();
            rectangles[index] = rect;
            this.setState({ rectangles });
        }
        if (shapes === "Arrow") {
            this.state.arrows.map(function (arrow, i) {
                if (arrow.name === name) {
                    index = i;
                }
            })
            let arrows = [...this.state.arrows];
            let arr = { ...arrows[index] };
            arr.x = event.target.x();
            arr.y = event.target.y();
            arrows[index] = arr;
            this.setState({ arrows });
        }
        if (shapes === "Text") {
            this.state.texts.map(function (text, i) {
                if (text.name === name) {
                    index = i;
                }
            })
            let texts = [...this.state.texts];
            let txt = { ...texts[index] };
            txt.x = event.target.x();
            txt.y = event.target.y();
            texts[index] = txt;
            this.setState({ texts });
        }
        if (shapes === "Image") {
            this.state.images.map(function (image, i) {
                if (image.name === name) {
                    index = i;
                }
            })
            let images = [...this.state.images];
            let img = { ...images[index] };
            img.x = event.target.x();
            img.y = event.target.y();
            images[index] = img;
            this.setState({ images });

        }


    }
    newProj() {
        this.setState({
            arrows: [],
            rectangles: [],
            circles: [],
            images: [],
            imageUrl: [],

            texts: []
        })
        localStorage.removeItem("projectID");

    }


    handleSubmit(event) {
        this.setState({ imgData: [] });
        const tName = {
            name: this.state.key
        };

        fetch(config.base_dir + '/tech/' + this.state.name).then((res) =>
            res.json()).then(data => {
                this.setState({ imgData: data.data });

            })
        event.preventDefault();
    }



    render() {
        if (this.state.project === true) {
            return <Redirect to='/projects' />
        }

        const imgurl = this.state.imgData.map((imgs, i) => (
            <div key={i} className="imag">
                <img alt=" " id={imgs.name}
                    ref={imgs.name}
                    alt=" "


                    onClick={this.assignImageUrl} dragable={true} height="100%" width="100%" object-fit="contain" src={imgs.url} ></img>
            </div>
        ));

        var downLink = null
        if (this.state.canvasUrl) {
            downLink = (<div>
                <button className="lftBtn"><a href={this.state.canvasUrl} download={this.state.fileName}>Download</a></button>
            </div>)
        }

        return (

            <Container className="main">
                <Row>
                    <Col xs="6" sm="4">
                        <div className="form" >
                            <InputGroup>
                                <Input placeholder="Technology name" value={this.state.value} onChange={this.handleChange} />
                                <Button addonType="append" onClick={this.handleSubmit}>Search</Button>
                            </InputGroup>
                            <div className="grid-container">
                                {imgurl}
                            </div>
                        </div>
                        <Shapes
                            addRightArrow={this.addRightArrow}
                            addcrc={this.addCircle}
                            addrect={this.addReact}
                            addLefttArrow={this.addLefttArrow}
                            addRigBotArrow={this.addRigBotArrow}
                            addRigUpArrow={this.addRigUpArrow}
                            addText={this.addText}
                            handleText={this.handleText}
                        />
                    </Col>
                    <Col xs="6" sm="8">
                        <div className="canv" id="canv">
                            <div id="container" className="container" ></div>
                            <Stage
                                container="canv"
                                width={this.state.stateWidth}
                                height={this.state.stageHeight}
                                opacity="1"

                                ref={stage => this.canv = stage}
                                onMouseDown={this.handleStageMouseDown}
                            >
                                <Layer>
                                    {this.state.rectangles.map((rect, i) => (
                                        <Rectangle onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...rect} />
                                    ))}
                                    {this.state.images.map((img, i) => (
                                        <Image onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...img} crossoOrigin="true" />
                                    ))}
                                    {this.state.arrows.map((lns, i) => (
                                        <Arrow onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...lns} />
                                    ))}
                                    {this.state.circles.map((crc, i) => (
                                        <Circle onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...crc} />
                                    ))}
                                    {this.state.texts.map((crc, i) => (
                                        <Text onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...crc} />
                                    ))}


                                    <TransformerComponent
                                        selectedShapeName={this.state.selectedShapeName}
                                        updateWH={this.updateWH}

                                    />

                                    {/* {image} */}



                                </Layer>
                            </Stage>
                        </div>
                        <div className="btns">
                            <Button className="lftBtn" onClick={this.newProj}>New Project</Button>
                            <Button className="lftBtn" onClick={this.clearAll}>Clear</Button>
                            <br />
                            <br />
                            <Button className="lftBtn" onClick={this.download}>Conver to Image</Button>

                            <br />
                            <br />
                            {downLink}
                            <br />
                            <Input onChange={this.handleProj} className="rghtBtn" type="text" placeholder="Project Name"></Input>

                            <br />
                            <br />
                            <Button className="rghtBtn" onClick={this.saveImage}>Save</Button>


                            <br />
                        </div>

                    </Col>
                </Row>

            </Container>
        );
    }
}

export default Forms;