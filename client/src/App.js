import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Login from './components/tool/NewUi/Login'
import Signup from './components/Signup'
import Newlogin from './components/Newlogin'
import Home from './components/tool/NewUi/Home'
// import Explainit from './components/Explainit'
import google from './components/testGoogle'
import DisplayShare from './components/tool/displayScreenshare'
import Project from './components/Project'
import git from './components/git'
import Profile from './components/profile'
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
          <Route path ="/connect/:callerid" component= {DisplayShare}/>
            <Route path ="/"  exact component={Home}/>
            <Route exact  path='/login' component={Login} />
            <Route exact  path='/newlogin' component={Newlogin} />
            <Route exact path='/profile/:userid' component ={Profile} />
            {/* <Route exact  path='/newhome' component={Newhome} /> */}
            {/* <Route exact  path='/explainIt' component={Explainit} /> */}
            <Route exact  path='/google' component={google} />
            <Route exact path='/git' component = {git} />
            <Route exact path='/project/:projectid' component={Project}/>
            <Route exact  path='/signup' component={Signup} />
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
