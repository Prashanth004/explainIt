import React, { Component } from 'react'
import './css/create.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from './tool/Form'
import {Redirect} from  'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
import './ErrorHnadle'
import config from '../config/config';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
   token:" ",
   projectid:null,
   email:" ",
   name:"",
 
   isloggedin:true
    };
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.changeProjectid = this.changeProjectid.bind(this)
}
componentDidMount(){
  let user = JSON.parse(localStorage.getItem('token'));
 
 
  axios.get(config.base_dir+`/users/`, { headers: {
          "Authorization"  :  user,
 
        }
    }).then(response => {
       this.setState({
        email:response.data.user.email,
        name:response.data.user.username
      })
    }).catch(err => {
      console.log("err :"+err)
      this.setState({
        isloggedin:false
      })
      });
  }

isAuthenticated(){
  const token = localStorage.getItem("token")
   return token && token.length > 10
 }
 changeProjectid(proID){
   var projectID = proID
   this.setState({
    projectid : projectID
   })
 }
    render() {
      

      const isAlreadyAuthenticated = this.isAuthenticated();
      const loginCheck = this.state.isloggedin
      return (
        
       
        <div>
         
          {(isAlreadyAuthenticated && loginCheck)?(
             <div>
             <Navbar name={this.state.name} />
           
           
          <Form paramsProjId = {this.projectid}/>
          </div>
          
          ):<Redirect to={{pathname:'./login'}}/>}
     
      </div>
      );
    }
  }
  
export default Create;