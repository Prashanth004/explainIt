import React, { Component } from 'react'
import { Button,Label, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import Form from './tool/Form'
import config from '../config/config'
import axios from 'axios'

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state ={
            title:"",
            question:"",
            token:" "

        }
        this.handleTitle = this.handleTitle.bind(this);
        this.handleQuestion = this.handleQuestion.bind(this);
        this.uploadProject = this.uploadProject.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    _isMounted =true
    componentWillMount(){
        if(this._isMounted){ 
       
        var token = JSON.parse(localStorage.getItem("token"))
        alert(token)
        this.setState({
            token:token
        })
    }
    }
    componentDidMount(){
        this._isMounted = true
    }
    handleTitle(event){
        if(this._isMounted){ 
        this.setState({
            title:event.target.value
        })
    }
    }
    
    handleQuestion(event){
        if(this._isMounted){ 
        this.setState({
            question:event.target.value
        })
    }
    }
    toggle(){
        this.props.Toggle()
    }
    uploadProject(textData, imgData, audioData, imgItems ){
        var issueID = " "
        var token = this.state.token
        var projectName = config.dataTime

        axios({
            method: 'post',
            url: config.base_dir + '/issues',
            headers: {
                "Authorization": token,
            },
            data: {
                issueTitle : this.state.title,
                question : this.state.question
            }
        }).then(response=>{
            if(this._isMounted){ 
            if(response.status==201){
                issueID = response.data.data.id
            }
            var fd = new FormData();

            fd.append('imageData', imgData);
            fd.append('projectName', projectName);
            fd.append('audioData', audioData);
            fd.append('issueID',issueID);
            fd.append('textExplain',textData);
            fd.append('isquestion',"true");
            axios({
                method: 'post',
                url: config.base_dir + '/project',
                headers: {
                    "Authorization": token,
                },
                data: fd
            }).then(response=>{
                if(this._isMounted){ 
                alert("project cressted")
                console.log(response)
                }
            })
        }
        })



    }
    componentWillUnmount(){
        this._isMounted = false
    }
  render() {
    return (
      <div>
      <Label>Title</Label>
        <Input type="text" onChange={this.handleTitle}/>
        <Label>Question</Label>
        <Input type="textarea" onChange={this.handleQuestion}/>
        <Form Toggle={this.toggle} uploadProject = {this.uploadProject}/>
      </div>
    )
  }
}
