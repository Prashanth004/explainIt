import React, { Component } from 'react'
import { Button, Label, Col, Container, Input, InputGroup, Row } from 'reactstrap';
import './css/login.css';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom'
import config from '../config/config';
import './ErrorHnadle'



class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      tohen: " "

    }
    this.uploadData = this.uploadData.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.logOut = this.logOut.bind(this);

    this.testCall = this.testCall.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);

  }
  isAuthenticated() {
    const token = localStorage.getItem("token")
    return token && token.length > 10
  }

  testCall(event) {
    event.preventDefault();
    fetch(config.base_dir+'/users/dashboard').then((res) =>
      res.json()).then(data => console.log(data))
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    }
    )

  }
  handlePassChange(event) {
    this.setState({
      password: event.target.value
    })

  }
  logOut(event) {


  }

  uploadData(event) {
    var loc_email =this.state.email;
    var loc_pass =this.state.password;
    if(loc_email==="" || loc_pass===""){
      alert("Field can not be empty")
    } 
    else{
    event.preventDefault();

    axios.post(config.base_dir+'/users/authenticate', {
      email: this.state.email,
      password: this.state.password,
    }).then(response => {

      if (response.status === 200) {

        console.log(response.data.token)

        localStorage.setItem('token', JSON.stringify(response.data.token))
        this.setState({});
      }
      else if(response.status == 401){
        alert("email id or password did not match")
      }
      

    }).catch((err) => {
      alert("email id or password did not match")
     
    })
  }




  }


  render() {
    const isAlreadyAuthenticated = this.isAuthenticated();
    return (


      <div>
        {isAlreadyAuthenticated ? <Redirect to={{ pathname: './' }} /> :
         (

          <Container className="containform">
            <Row >
              <Col>

                <Label>Email Id :</Label>
                <Input placeholder="abc@example.com" value={this.state.email} onChange={this.handleEmailChange} />

                <Label>Password:</Label>

                <Input placeholder="password" type="password" value={this.state.password} onChange={this.handlePassChange} />
                <br/>
               
                <Button addonType="append" onClick={this.uploadData}>Submit</Button>
               
               
                <Button addonType="append" type="delete"><Link to='/signup'>SignUp</Link></Button>
               


              </Col>
            </Row>
          </Container>
        )}
      </div>


    )
  }
}


export default componentName;

