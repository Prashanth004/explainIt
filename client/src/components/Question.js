import React, { Component } from 'react'
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import config from '../config/config'
import axios from 'axios'
import Navbar from './Navbar'
import './css/question.css'
import Form from './tool/Form'
import {Redirect,Link} from  'react-router-dom';;

class Question extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quesProject: null,
            question: " ",
            explainMod: false,
            issueProjects: [],
            issueTitile:" ",
            alreadyExplain: false,
            test:"1",
            issueId:" ",
            token:" "
           
        }
        this.startExplain = this.startExplain.bind(this);
        this.closeExplainTool = this.closeExplainTool.bind(this);
        this.toggle = this.toggle.bind(this);
        this.uploadProject = this.uploadProject.bind(this);

    }
    _isMounted =false

    // this._isMounted = true
    componentDidMount() {
       this._isMounted =true
        var token = JSON.parse(localStorage.getItem("token"))
        if(this._isMounted){
        this.setState({
            explainMod:false,
            issueId:this.props.match.params.id,
            token:token
        })
    }
        axios({
            method: 'get',
            url: config.base_dir + '/project/issues/' + this.props.match.params.id,
            headers: {
                "Authorization": token,
            }
        }).then(response => {
            if(this._isMounted){
                console.log("aaaaaaaaaaaaaaaaaaaa",response)
            var PrejectArray = response.data.data;
            const projID = PrejectArray.find((response)=>response.email === localStorage.getItem("email") )
            if(projID){
                this.setState({
                    alreadyExplain: true
                })
            }
            console.log("projID : ",projID)
            console.log("projects : ",PrejectArray)
            if (response.status === 200) {

                this.setState({
                    issueProjects: PrejectArray
                })
            }
        }
            
        })

        axios({
            method: 'get',
            url: config.base_dir + '/issues/' + this.props.match.params.id,
            headers: {
                "Authorization": token,
            }

        }).then(response => {
            if(this._isMounted){
            this.setState({
                question: response.data.msg.question,
                issueTitile : response.data.msg.title
            })
            var projId = []
            if (response.status === 200) {

                console.log("reponse : ", response)

            }
        }
        }).catch(function (err) {
            if(this._isMounted){
            console.log("error : ", err)
            }
        })
    
    }
  
    componentWillUnmount(){
        this._isMounted =false
    }
    uploadProject(textData, imgData, audioData, imgItems ){
        var issueID = this.state.issueId
        var token = this.state.token
        var projectName = config.dataTime
        var fd = new FormData();
        fd.append('imageData', imgData);
        fd.append('projectName', projectName);
        fd.append('audioData', audioData);
        fd.append('issueID',issueID);
        fd.append('textExplain',textData);
        fd.append('isquestion',false);
        axios({
            method: 'post',
            url: config.base_dir + '/project',
            headers: {
                "Authorization": token,
            },
            data: fd
        }) .then(response => {
            if(this._isMounted){

            if (response.status === 201) {
                alert("successfull")
                axios({
                    method: 'post',
                    url: config.base_dir + '/project/items',
                    headers: {
                        "Authorization": token,
                    },
                    data: {
                        projectName: projectName,
                        items: imgItems,
                    }

                }).then(response => {
                    if (response.status === 200) {
                        this.props.Toggle()
                     alert("successfull")
                    }
                })
            }
        }
        }).catch((err) => {

            alert(err)
        })


    }


    toggle() {
        if(this._isMounted){
        this.setState({ collapse: !this.state.collapse });
        }
      }


    closeExplainTool(){
        localStorage.setItem("issueid",null)
        if(this._isMounted){
       this.setState({
       
        explainMod:!this.state.explainMod,

       });
    }
      
    //    
    }
   
    startExplain() {
        localStorage.setItem("issueid", this.props.match.params.id)
        localStorage.setItem("qORa", "answer")
        if(this._isMounted){
        this.setState({ collapse: !this.state.collapse });
        }
    }


    render() {
        var explaintool = null
        var explianButton = null;



      
        const issueProjects = this.state.issueProjects.map((projs, i) => (
           
            <div key={i} className="partProject">
                <div>
                    <p>{projs.textexplain}</p>
                </div>
                <div className="ProjImage">
                    <img src={projs.imgurl} width="100%" height="100%"></img>
                </div>
              
                <div className="audio">
                    <audio controls={true} src={projs.audiofilepath} ></audio>
                </div>
            </div>
        ))
        // if(!this.state.alreadyExplain){
            explianButton = (<button onClick={this.startExplain}>Explian it</button>)
        // }

      
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="question">
                        <h3>{this.state.issueTitile}</h3>
                        <p>{this.state.question}?</p>
                    </div>
                    <div className="explain">
                        {explianButton}
                    </div>

                <Collapse isOpen={this.state.collapse}>
          <Form  Toggle={this.toggle} uploadProject ={this.uploadProject}/>
          <button onClick={this.toggle} >Close</button>
        </Collapse>
      

                    <div className="projectsList">

                       {issueProjects}
                    </div>
                </div>


            </div>
        )
    }
}
export default Question