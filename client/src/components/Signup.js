import React, { Component } from 'react'
import {Input,Label,FormGroup,Form,Button} from 'reactstrap'
import { Container } from 'konva';
import './css/form.css'
import axios from 'axios';
import config from '../config/config';
import { Redirect, Link } from 'react-router-dom';
import './ErrorHnadle'




export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={
            name:"",
            email:"",
            password:"",
            confpassword: "",
            SignSuccess: false
        }
        this.submitForm = this.submitForm.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfPassword = this.handleConfPassword.bind(this)
    }
    handleName(event){
this.setState({
    name:event.target.value
})
    }
    handleEmail(event){
        this.setState({
            email:event.target.value
        })
    }
    handleConfPassword(event){
        this.setState({
            confpassword: event.target.value
        })
    }
    handlePassword(event){
        this.setState({
            password:event.target.value
        })
    }
    submitForm(event){
        var name = this.state.name;
        var eamil = this.state.email;
        var password= this.state.password;
        var confpassword = this.state.confpassword;
        if(name === ""  || eamil ==="" || password === "" || confpassword === ""){
            alert("No field can be empty")
        }
        else if(password !== confpassword){
            alert("passwrods dont match")
        }
        else{
            var flag =0;

        axios.post(config.base_dir+'/users/register', {
      name :this.state.name ,     
      email: this.state.email,
      password: this.state.password,
      passwordConf : this.state.confpassword
    }).then(response=>{
       if(response.status === 200)
       {
        this.setState({
            SignSuccess:true
           })
           alert("Successfull")
           flag=1;
          
       }
       else{
           alert("Not able to SignUp ")
           console.log(response.data)
       }
    })
    .catch(err=>{
        alert("Not able to SignUp ");
        console.log(err)
    })
    alert("i get excecuted")
    setTimeout(function(){
     
    if(flag === 1){
        
        this.setState({
            SignSuccess:true
           })
    }
},100);
}


    }
  render() {
    const successFlag= this.state.SignSuccess
    return (
        <div>
             {successFlag ? <Redirect to={{ pathname: './' }} /> :(



  <div className="containform">
        <Form>
            <FormGroup>
          <Label>Name</Label>
          <Input onChange={this.handleName}value={this.state.name} type="text" name="email" id="exampleEmail" placeholder="Name" />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input onChange={this.handleEmail} value={this.state.email}type="email" name="email" id="exampleEmail" placeholder="email" />
        </FormGroup>
        <FormGroup>
          <Label >Password</Label>
          <Input onChange={this.handlePassword} value={this.state.password}type="password" name="password" id="examplePassword" placeholder="password" />
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword"> Confirm Password</Label>
          <Input onChange={this.handleConfPassword} value={this.state.confpassword} type="password" name="password" id="examplePassword" placeholder="password again" />
        </FormGroup>

        <Button onClick={this.submitForm}>Signup</Button>
        </Form>
        </div> 

   )}
        </div>

    )
  }
}

