import React, { Component } from 'react'
import './css/home.css';

import {withRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Collapse,Col, Container, Input, InputGroup, Row } from 'reactstrap';

import Form from './tool/Form'
import {Redirect,Link} from  'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
import './ErrorHnadle'
import config from '../config/config';
import AskQuestion from './Askquestion'


class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
   token:" ",
   projectid:null,
   email:" ",
   name:"",
   issues:[],
 
   isloggedin:true
    };
  
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.toggle = this.toggle.bind(this);
   
}
_isMounted =false

componentDidMount(){
  this._isMounted = true
  let user = JSON.parse(localStorage.getItem('token'));
  axios({
    method: 'get',
    url: config.base_dir + '/issues',
    headers: {
        "Authorization": user,
    }
}).then(response => {
  if(this._isMounted){
  if (response.status == 200) {
  
    console.log("projects : ", response.data)
   
 
     
        this.setState({
            issues: response.data.msg
        
        })
      }
       
    
  }
})
 
  axios.get(config.base_dir+`/users/`, { headers: {
          "Authorization"  :  user,
        }
    }).then(response => {
      if(this._isMounted){
       this.setState({
        email:response.data.user.email,
        name:response.data.user.username
      })
    
      localStorage.setItem("email",response.data.user.email)
      localStorage.setItem("name",response.data.user.email)
    }
    }).catch(err => {
      if(this._isMounted){
      console.log("err :"+err)
     
      this.setState({
        isloggedin:false
      })
    }
      });
  }
 
componentWillUnmount(){
  this._isMounted = false
}
  nextPath(path) {
    if(this._isMounted){
      this.props.history.push(path);
    }
   
  }

 


  toggle() {
    if(this._isMounted){
    this.setState({ collapse: !this.state.collapse });
    }
  }

isAuthenticated(){
  const token = localStorage.getItem("token")
   return token && token.length > 10
 }

    render() {
      
const issues=this.state.issues.map((issues,i)=>(
 
      <div className="question" key={i}>
                        <h3>{issues.title}</h3>
                        <p>{issues.question}</p>
                       <button id={issues.id} onClick={() => this.nextPath('/question/'+issues.id)} >Open</button>
      </div>

     
)
)

      const isAlreadyAuthenticated = this.isAuthenticated();
      const loginCheck = this.state.isloggedin
      return (
        
       
        <div>
         
          {(isAlreadyAuthenticated && loginCheck)?(
             <div>
             <Navbar name={this.state.name} />
           <div className="searchQuestion">
           
           <Button margin="10px" onClick={this.toggle}>Ask Questions</Button>
         
           
           <Collapse isOpen={this.state.collapse}>
           <AskQuestion Toggle={this.toggle}/>
           </Collapse>
           <Input type="text" placeholder="Search for Questions"></Input>
           </div>
           <div className="container">
           {issues} 
           </div>

          </div>
          
          ):<Redirect to={{pathname:'./login'}}/>}
     
      </div>
      );
    }
  }
  
export default Home;