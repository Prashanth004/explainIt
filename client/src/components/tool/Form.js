import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Layer, Stage } from 'react-konva';
import '../css/form.css';
import '../css/home.css';
import Arrow from "./Arrow";
import Circle from "./Circle";
import Image from "./Image";
import Elipse from './Elipse'
import Triangle from "./Triangle"
import Rectangle from "./Reactangle";
import Shapes from './Shapes';
import Text from './Text';
import TransformerComponent from "./TransformerComponent";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import config from '../../config/config';
import '../ErrorHnadle'
import { creatAnsProject } from '../../actions/projectActions'
import '../css/hint.css'
import ScreenShare from './NewUi/ScreenShare'
import ScreenRecorder from './NewUi/ScreenRecorder'
import { SCREEN_SHARE, SCREEN_RECORD } from '../../actions/types'
import { displayShareScreen, displayFullScrenRecord, displayFullScreShare, displayScrenRecord } from '../../actions/toolActions'
import AudioRec from './AudioRecord'


class Forms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            imgData: [],
            imageUrl: [],
            images: [],
            circles: [],
            elipse: [],
            arrows: [],
            texts: [],
            textValue: null,
            rectangles: [],
            triangle: [],
            stageHeight: 357,
            stateWidth: 507,
            imgWidth: 60,
            imgHeight: 60,
            selectedShapeName: '',
            canvasUrl: '',
            fileName: " ",
            projName: "",
            project: false,
            projectid: this.projectid,
            audioData: null,
            textExplain: "",
            explainMod: true,
            error: null,
            errorInfo: null,
            canvas: this.canv,
            recorder: null,
            video: '',
            audioStream: null,
            canvasStream: null,
            isRecordingStarted: false,
            isStoppedRecording: false,
            initialsize: false,
            showForm: false,
            showShareBtns: false,
            showRecordBtns: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.assignImageUrl = this.assignImageUrl.bind(this);
        this.addReact = this.addReact.bind(this);
        this.addCircle = this.addCircle.bind(this);
        this.addElipse = this.addElipse.bind(this);
        this.addTriangle = this.addTriangle.bind(this);
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
        this.openProj = this.openProj.bind(this);
        this.newProj = this.newProj.bind(this);
        this.assignAudioUrl = this.assignAudioUrl.bind(this);
        this.upDateTxtExplain = this.upDateTxtExplain.bind(this);
        this.pushData = this.pushData.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.shareFullScreenShare = this.shareFullScreenShare.bind(this)
        this.recordScreen = this.recordScreen.bind(this);
        this.displayForm = this.displayForm.bind(this);
        this.addRountRect = this.addRountRect.bind(this);
        this.addDiamond = this.addDiamond.bind(this);
        this.displayShareOptions = this.displayShareOptions.bind(this);
        this.displayRecordBtn = this.displayRecordBtn.bind(this);
        this.recordFullScreen = this.recordFullScreen.bind(this);


    }
    test() {
        alert("sklmnfjngdf")
    }
    displayShareOptions() {
        this.setState({
            showRecordBtns: false,
            showShareBtns: !this.state.showShareBtns
        })
    }
    shareScreen() {
        this.props.displayShareScreen()
    }
    shareFullScreenShare() {
        this.props.displayFullScreShare()
    }


    displayRecordBtn() {
        this.setState({
            showShareBtns: false,
            showRecordBtns: !this.state.showRecordBtns
        })
    }
    recordScreen() {
        this.props.displayScrenRecord()
    }
    recordFullScreen() {
        this.props.displayFullScrenRecord()
    }







    displayForm() {
        this.setState({
            showForm: true
        })
    }



    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        this.setState({
            error: error,
            errorInfo: info
        })
    }

    upDateTxtExplain(event) {
        if (this._isMounted) {
            this.setState({
                textExplain: event.target.value
            })
        }
    }

    handleProj(event) {
        if (this._isMounted) {
            this.setState({
                projName: event.target.value
            })
        }
    }

    updateWH(obbj) {
        if (this._isMounted) {
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
                cir.strokeWidth = 1;
                cir.rotation = obbj.rotation();
                cir.radius = obbj.radius();
                circles[index] = cir;
                if (this._isMounted) {
                    this.setState({ circles });
                }
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
                rect.strokeWidth = 1;
                rect.y = obbj.y();
                rectangles[index] = rect;
                if (this._isMounted) {
                    this.setState({ rectangles });
                }
            }
            if (shapes === "RegularPolygon") {
                this.state.triangle.map(function (triangle, i) {
                    if (triangle.name === name) {
                        index = i;
                    }
                })
                let triangleRep = [...this.state.triangle];
                let trio = { ...triangleRep[index] };
                trio.x = obbj.x();
                trio.width = obbj.width()
                trio.height = obbj.height()
                trio.rotation = obbj.rotation()
                trio.scaleX = obbj.scaleX()
                trio.scaleY = obbj.scaleY()
                trio.strokeWidth = 1;
                trio.y = obbj.y();
                triangleRep[index] = trio;
                if (this._isMounted) {
                    this.setState({ triangle: triangleRep });
                }
            }
            if (shapes === "Ellipse") {
                this.state.elipse.map(function (elipse, i) {
                    if (elipse.name === name) {
                        index = i;
                    }
                })
                let elipseRep = [...this.state.elipse];
                let eli = { ...elipseRep[index] };
                eli.x = obbj.x();
                eli.width = obbj.width()
                eli.height = obbj.height()
                eli.rotation = obbj.rotation()
                eli.scaleX = obbj.scaleX()
                eli.scaleY = obbj.scaleY()
                eli.strokeWidth = 1;
                eli.y = obbj.y();
                elipseRep[index] = eli;
                if (this._isMounted) {
                    this.setState({ elipse: elipseRep });
                }

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
                if (this._isMounted) {
                    this.setState({ arrows });
                }
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
                if (this._isMounted) {
                    this.setState({ texts });
                }
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
                if (this._isMounted) {
                    this.setState({ images });
                }
                console.log(this.state.images)
            }
        }
    }


    handleChange(event) {
        if (this._isMounted) {
            this.setState({ name: event.target.value });
        }
    }

    convToJsov(event) {
        if (this._isMounted) {
            const stateJson = (this.canv).toJSON();
        }
    }
    download(event) {
        if (this._isMounted) {
            var dateNow = new Date().toString()
            const url = (this.canv).toDataURL();

            this.setState({
                canvasUrl: url,
                fileName: dateNow
            })
        }



    }


    handleStageMouseDown = e => {
        if (this._isMounted) {
            // clicked on stage - cler selection
            if (e.target === e.target.getStage()) {
                if (this._isMounted) {
                    this.setState({
                        selectedShapeName: ''
                    });
                }
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
            const img = this.state.images.find(i => i.name === name);
            const trio = this.state.triangle.find(tr => tr.name === name);
            const eli = this.state.elipse.find(el => el.name === name);
            if (rect || cir || arr || txt || img || trio || eli) {
                if (this._isMounted) {
                    this.setState({
                        selectedShapeName: name
                    });
                }

            } else {
                if (this._isMounted) {
                    this.setState({
                        selectedShapeName: ''
                    });
                }
            }
        }
    };

    addRightArrow(event) {
        let lne = null
        lne = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            strokeWidth: 4,
            draggable: true,
            name: String(Math.random()),
            points: [0, 0, 70, 0]

        }
        if (this._isMounted) {
            this.setState({
                arrows: [...this.state.arrows, lne]
            })
        }
    }


    addLefttArrow(event) {
        let lne = null
        lne = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            draggable: true,
            strokeWidth: 4,
            name: String(Math.random()),
            points: [0, 0, 70, 0, 1, 0]

        }
        if (this._isMounted) {
            this.setState({
                arrows: [...this.state.arrows, lne]
            })
        }
    }
    clearAll(event) {
        if (this._isMounted) {
            this.setState({
                arrows: [],
                rectangles: [],
                circles: [],
                images: [],
                imageUrl: [],

                texts: []
            })
        }


    }
    addRigBotArrow(event) {
        let lne = null
        lne = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            draggable: true,
            scaleX: 1,
            strokeWidth: 4,
            scaleY: 1,
            rotation: 0,
            name: String(Math.random()),
            points: [0, 0, 50, 0, 50, 50]

        }
        if (this._isMounted) {
            this.setState({
                arrows: [...this.state.arrows, lne]
            })
        }
    }
    addRigUpArrow(event) {
        let lne = null
        lne = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            strokeWidth: 4,
            draggable: true,
            name: String(Math.random()),
            points: [0, 0, 50, 0, 50, -50]

        }
        if (this._isMounted) {
            this.setState({
                arrows: [...this.state.arrows, lne]
            })
        }
    }

    addElipse() {
        let eli = null
        eli = {
            x: Math.floor((Math.random() * 350) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            draggable: true,
            strokeWidth: 1,
            radius: {
                x: 50,
                y: 30
            },
            name: String(Math.random())
        }
        if (this._isMounted) {
            this.setState({
                elipse: [...this.state.elipse, eli]
            })
        }
    }

    addCircle(event) {
        let crcle = null
        crcle = {
            x: Math.floor((Math.random() * 350) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            draggable: true,
            strokeWidth: 1,
            radius: 50,
            name: String(Math.random())
        }
        if (this._isMounted) {
            this.setState({
                circles: [...this.state.circles, crcle]
            })
        }

    }
    addText(event) {
        if (this._isMounted) {
            let txt = null
            txt = {
                x: Math.floor((Math.random() * 320) + 50),
                y: Math.floor((Math.random() * 250) + 50),
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

    }
    _isMounted = true

    componentWillMount() {
        if (this._isMounted) {
            document.addEventListener("keydown", this.deleteThis, false);
            console.log("prog  in url is :" + this.props.paramsProjId)
            var proID = localStorage.getItem("projectID")
            var token = JSON.parse(localStorage.getItem("token"))
            if (proID !== null) {
                axios({
                    method: 'get',
                    url: config.base_dir + '/api/project/items/' + proID,
                    headers: {
                        "Authorization": token,
                    }
                }).then(response => {
                    console.log(" proID : ", proID)
                    console.log("response.data : ", response.data)
                    if (response.status === 200) {
                        var items = (response.data.msg.items.shapeitems.children[0].children)
                        items.map(obg => {
                            if (obg.className === "Rect") {
                                if (this._isMounted) {
                                    this.setState({
                                        rectangles: [...this.state.rectangles, obg.attrs]
                                    })
                                }
                            }
                            if (obg.className === "Circle") {
                                if (this._isMounted) {
                                    this.setState({
                                        circles: [...this.state.circles, obg.attrs]
                                    })
                                }
                            }
                            if (obg.className === "Ellipse") {
                                if (this._isMounted) {
                                    this.setState({
                                        elipse: [...this.state.elipse, obg.attrs]
                                    })
                                }
                            }
                            if (obg.className === "RegularPolygon") {
                                if (this._isMounted) {
                                    this.setState({
                                        trianlge: [...this.state.triangle, obg.attrs]
                                    })
                                }
                            }
                            if (obg.className === "Arrow") {
                                if (this._isMounted) {
                                    this.setState({
                                        arrows: [...this.state.arrows, obg.attrs]
                                    })
                                }
                            }
                            if (obg.className === "Text") {
                                if (this._isMounted) {
                                    this.setState({
                                        texts: [...this.state.texts, obg.attrs]
                                    })
                                }
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
                                imageSrc: img.imageSrc,
                                crossOrigin: "anonymous",
                                name: img.name,
                                draggable: true
                            }
                            if (this._isMounted) {
                                this.setState({
                                    images: [...this.state.images, img1]

                                })
                            }

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
                var self = this
                setTimeout(() => {
                    self.addReactFull()
                }, 2000)

            }

        }

    }
    componentDidMount() {
        this.props.onRef(this)

        this._isMounted = true
    }

    deleteThis(event) {

        if (this._isMounted) {

            if (event.keyCode === 46) {
                var array = []
                var index = null
                if (this.state.selectedShapeName !== '') {
                    const name = this.state.selectedShapeName
                    const rect = this.state.rectangles.find(r => r.name === name);
                    const cir = this.state.circles.find(c => c.name === name);
                    const arr = this.state.arrows.find(a => a.name === name);
                    const txt = this.state.texts.find(t => t.name === name);
                    const img = this.state.images.find(i => i.name === name);
                    const tri = this.state.triangle.find(tr => tr.name === name);
                    const eli = this.state.elipse.find(el => el.name === name);
                    if (rect) {
                        array = [...this.state.rectangles]
                        index = array.indexOf(rect)
                        if (index !== -1) {
                            array.splice(index, 1);
                            if (this._isMounted) {
                                this.setState({ rectangles: array });
                            }
                        }
                    }
                    else if (tri) {
                        array = [...this.state.triangle]
                        index = array.indexOf(tri)
                        if (index !== -1) {
                            array.splice(index, 1);
                            if (this._isMounted) {
                                this.setState({ triangle: array });
                            }
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
                    else if (eli) {
                        array = [...this.state.elipse]
                        index = array.indexOf(eli)
                        if (index !== -1) {
                            array.splice(index, 1);
                            this.setState({ elipse: array });
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
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
        this._isMounted = false
    }
    addRountRect() {
        let recto = null
        recto = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 0,
            width: 140,
            height: 60,
            scaleX: 1,
            scaleY: 1,
            strokeWidth: 1,
            fill: "transparent",
            draggable: true,
            connerRadius: 50,
            name: String(Math.random())
        }
        if (this._isMounted)
            this.setState({
                rectangles: [...this.state.rectangles, recto]

            })

    }
    addTriangle() {

        let trio = null;
        trio = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 0,
            sides: 3,
            radius: 40,
            scaleX: 1,
            scaleY: 1,
            strokeWidth: 1,
            fill: "transparent",
            draggable: true,
            connerRadius: 0,
            name: String(Math.random())
        }
        if (this._isMounted) {
            this.setState({
                triangle: [...this.state.triangle, trio]

            })
        }
    }
    addDiamond() {
        let recto = null
        recto = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 45,
            width: 80,
            height: 80,
            scaleX: 1,
            scaleY: 1,
            strokeWidth: 1,
            fill: "transparent",
            draggable: true,
            connerRadius: 0,
            name: String(Math.random())
        }
        if (this._isMounted) {
            this.setState({
                rectangles: [...this.state.rectangles, recto]

            })
        }

    }
    addReact(event) {
        let recto = null
        recto = {
            x: Math.floor((Math.random() * 300) + 50),
            y: Math.floor((Math.random() * 250) + 50),
            rotation: 0,
            width: 100,
            height: 60,
            scaleX: 1,
            scaleY: 1,
            strokeWidth: 1,
            fill: "transparent",
            draggable: true,
            connerRadius: 0,
            name: String(Math.random())
        }
        if (this._isMounted) {
            this.setState({
                rectangles: [...this.state.rectangles, recto]

            })
        }

    }
    addReactFull() {
        let recto = null
        recto = {
            x: -6,
            y: -6,
            width: 516,
            height: 420,
            strokeWidth: 0.5,
            fill: config.canvBackground,
            draggable: false,
            connerRadius: 0,
            name: String(Math.random())
        }
        this.setState({
            rectangles: [...this.state.rectangles, recto]

        })
    }
    handleText(event) {
        if (this._isMounted) {
            this.setState({ textValue: event.target.value });
        }
    }

    assignImageUrl(event) {
        if (this.componentDidMount) {
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
                x: Math.floor((Math.random() * 350) + 50),
                y: Math.floor((Math.random() * 250) + 50),
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
            if (this._isMounted) {
                this.setState({
                    images: [...this.state.images, img]

                })
                this.setState({
                    imageUrl: [...this.state.imageUrl, image1]
                })
            }
        }
    }
    assignAudioUrl(AudioUrl) {


        console.log("AudioUrl : ", AudioUrl)
        if (this._isMounted) {
            this.setState({
                audioData: AudioUrl
            })
        }
    }


    assignImageUrl(event) {
        if (this._isMounted) {
            this.setState({
                imgData: []
            })
        }
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
        if (this._isMounted) {
            this.setState({
                images: [...this.state.images, img]

            })
            this.setState({
                imageUrl: [...this.state.imageUrl, image1]
            })
        }
    }
    pushData(fileData) {
        if (this._isMounted) {
            console.log("clicked")
            var shapeitems = null
            var textExplain = this.state.textExplain
            if (this.canv) {
                var imgData = (this.canv).toDataURL()
                var items = {
                    shapeitems: JSON.parse(shapeitems),
                    images: this.state.images
                }
            }
            else {
                var imgData = config.null
                var items = {}
            }
            var isquestion = " "
            var videoData = fileData;
            console.log(" videoData : ", videoData)
            isquestion = null;
            var issueIdThisCpm = null



            if (this.props.issueId !== null) {
                console.log("stage 1")

                console.log("ths is runnign")
                isquestion = "false"
                issueIdThisCpm = this.props.issueId


            }
            else {
                console.log("stage 2 error")
                isquestion = "true"
            }
            console.log("clicked sending..")

            this.props.creatAnsProject(textExplain, imgData, videoData, items, isquestion, issueIdThisCpm)

        }
    }



    openProj(event) {
        if (this._isMounted) {
            this.setState({
                project: true
            })
        }
    }

    handleDragEnd(event) {
        if (this._isMounted) {
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
                if (this._isMounted) {
                    this.setState({ circles });
                }
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
                if (this._isMounted) {
                    this.setState({ rectangles });
                }
            }
            if (shapes === "RegularPolygon") {
                this.state.triangle.map(function (triangle, i) {
                    if (triangle.name === name) {
                        index = i;
                    }
                })
                let triangle = [...this.state.triangle];
                let trio = { ...triangle[index] };
                trio.x = event.target.x();
                trio.y = event.target.y();
                triangle[index] = trio;
                if (this._isMounted) {
                    this.setState({ triangle });
                }
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
                if (this._isMounted) {
                    this.setState({ arrows });
                }
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
                if (this._isMounted) {
                    this.setState({ texts });
                }
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
                if (this._isMounted) {
                    this.setState({ images });
                }

            }

        }
    }
    newProj() {
        if (this._isMounted) {
            this.setState({
                arrows: [],
                rectangles: [],
                circles: [],
                images: [],
                imageUrl: [],

                texts: []
            })
        }
        localStorage.removeItem("projectID");

    }


    handleSubmit(event) {
        if (this._isMounted) {
            this.setState({ imgData: [] });
        }
        const tName = {
            name: this.state.key
        };

        fetch(config.base_dir + '/api/tech/' + this.state.name).then((res) =>
            res.json()).then(data => {
                if (this._isMounted) {
                    this.setState({ imgData: data.data });
                }

            })
        event.preventDefault();
    }



    render() {
        if (this.props.ShareAction) {

            this.test()
        }
        else {

        }
        var shareElement = null;
        const imgurl = this.state.imgData.map((imgs, i) => (
            <div key={i} className="imag">
                <img id={imgs.name}
                    ref={imgs.name}
                    alt=" "
                    onClick={this.assignImageUrl} dragable={true} height="100%" width="100%" object-fit="contain" src={imgs.url} ></img>
            </div>
        ));

        var ShareBtns = null
        var recordBtns = null;

        if (this.state.showShareBtns) {
            ShareBtns = (<div classsName="Sharebtns">
                <button className="buttonDark" onClick={this.shareScreen}>
                    Share canvas
                    </button>
                <button className="buttonDark" onClick={this.shareFullScreenShare}>
                    Share entire screen
                    </button>

            </div>)
        }
        else{
            ShareBtns=(<div className="screenShareBtn">
            <span className="hint--bottom" aria-label="Share screen!">
                <img onClick={this.displayShareOptions} height="100%" width="100%" src={require('../images/screensharing.png')} />
            </span>
        </div> )
        }
         if (this.state.showRecordBtns) {
            recordBtns = (<div classsName="Sharebtns">
                <button className="buttonDark" onClick={this.recordScreen}>
                    Record canvas
            </button>
                <button className="buttonDark" onClick={this.shareElement}>
                    Record entire screen
            </button>

            </div>)
        }
        else {
            recordBtns = ( <div className="recorderScreen">
            <div classsName="Sharebtns">
                <span className="hint--bottom" aria-label="Record screen!">
                    <img onClick={this.displayRecordBtn} height="100%" width="100%" src={require('../images/download.jpg')} />
                </span>
            </div>
        </div>)

        }
        // if (this.props.shareAction === true) {
            var form = (
                <div>
                    <div className="logo" >
                        <div className="logoSrchGrp">
                            <input className="inputText" placeholder="Search for the logo" value={this.state.value} onChange={this.handleChange} />
                            <button addonType="append" className="buttonDark" onClick={this.handleSubmit}>Search</button>
                        </div>
                        <div className="grid-container">
                            {imgurl}
                        </div>

                    </div>
                    <div className="canvasTool">
                        <div className="canvOut">
                            <div className="canv" ref={a => this.DivToRecord = a} id="canv">
                                <Stage
                                    container="canv"
                                    width={this.state.stateWidth}
                                    height={this.state.stageHeight}
                                    opacity={1}
                                    ref={stage => this.canv = stage}
                                    onMouseDown={this.handleStageMouseDown}>

                                    <Layer>
                                        {this.state.rectangles.map((rect, i) => (
                                            <Rectangle onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...rect} />
                                        ))}
                                        {this.state.images.map((img, i) => (
                                            <Image onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...img} crossoOrigin={true} />
                                        ))}
                                        {this.state.arrows.map((lns, i) => (
                                            <Arrow onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...lns} />
                                        ))}
                                        {this.state.circles.map((crc, i) => (
                                            <Circle onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...crc} />
                                        ))}
                                        {this.state.elipse.map((eli, i) => (
                                            <Elipse onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...eli} />
                                        ))}
                                        {this.state.texts.map((crc, i) => (
                                            <Text onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...crc} />
                                        ))}
                                        {this.state.triangle.map((crc, i) => (
                                            <Triangle onDragEnd1={this.handleDragEnd} onKeyDown={this.deleteThis} key={i} {...crc} />
                                        ))}
                                        <TransformerComponent
                                            selectedShapeName={this.state.selectedShapeName}
                                            updateWH={this.updateWH}
                                        />
                                    </Layer>
                                </Stage>
                            </div>
                        </div>
                        <div>
                            <Shapes
                                addRightArrow={this.addRightArrow}
                                addcrc={this.addCircle}
                                addrect={this.addReact}
                                addLefttArrow={this.addLefttArrow}
                                addRigBotArrow={this.addRigBotArrow}
                                addRigUpArrow={this.addRigUpArrow}
                                addText={this.addText}
                                handleText={this.handleText}
                                addRountRect={this.addRountRect}
                                addTriangle={this.addTriangle}
                                addDiamond={this.addDiamond}
                                addElipse={this.addElipse}
                            />
                        </div>
                    </div>
                </div>
            )
        // }
        // else {
        //     var form = (
        //         <div className="shareScreen">
        //             <div className="btnContainers">
        //             {ShareBtns}
        //             </div>
        //             <div  className="btnContainers">
        //                {recordBtns}
        //             </div>
        //         </div>
        //     )
        // }
        if (this.state.errorInfo == null) {
            if (this.state.project === true) {
                return <Redirect to='/projects' />
            }

            var downLink = null
            if (this.state.canvasUrl) {
                downLink = (<div>
                    <button className="lftBtn"><a href={this.state.canvasUrl} download={this.state.fileName}>Download</a></button>
                </div>)
            }
            return (

                <div className="formContainerTool">

                    <div className="textExplainDiv">
                        <textarea className="textExplain" placeholder="Explain in text" onChange={this.upDateTxtExplain} placeholder="type here to explain"></textarea>
                    </div>

                    <div className="partTwoInput">
                        {form}
                    </div>



                    {shareElement}
                    {/* <AudioRec assignAudioUrl={this.assignAudioUrl} canvass={this.recordScreen} stopRecord={this.stopRecord} /> */}


                    {/* <div className="footer">
                        <button className="buttonDark" onClick={this.clearAll}>Clear</button>
                        <button className="buttonDark" onClick={this.pushData}>Save</button>
                    </div> */}
                    {/* <Button onClick={this.newProj}>New Project</Button> */}
                    {/* <Button onClick={this.download}>Conver to Image</Button> */}
                    {/* {downLink} */}
                    {/* <Input onChange={this.handleProj} type="text" placeholder="Project Name"></Input> */}
                    <br />
                </div >
            );

        }
    }
}
Forms.PropType = {
    creatAnsProject: PropType.func.isRequired,
    displayShareScreen: PropType.func.isRequired,
    displayScrenRecord: PropType.func.isRequired,
    displayFullScrenRecord: PropType.func.isRequired
};
const mapStateToProps = state => ({
    issueId: state.issues.currentIssueId,
    shareAction: state.tools.displayForm,
    videoData: state.tools.videoBlob
})
export default connect(mapStateToProps, { displayFullScrenRecord, creatAnsProject, displayFullScreShare, displayShareScreen, displayScrenRecord })(Forms)
