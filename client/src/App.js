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
import ShareWindow from './components/tool/NewUi/ShareWindow'
import Explainit from './components/tool/NewUi/ExplainPage'
import google from './components/testGoogle'
import DisplayShare from './components/tool/displayScreenshare'
import Project from './components/Project'
import visitProfile from './components/tool/NewUi/connectProfile'
import git from './components/git'
import inbox from './components/tool/NewUi/Inbox'
// import Profile from './components/tool/NewUi/connectProfile'
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
          <Route path ="/connect/:callerid" component= {DisplayShare}/>
            <Route exact path ="/" component={Home}/>
            <Route exact path = "/profile/:encrTwitterHandle"component = {visitProfile}/>
            <Route exact  path='/login' component={Login} />
            <Route exact  path='/newlogin' component={Newlogin} />
            <Route exact  path='/explainIt' component={Explainit} />
            <Route exact  path='/google' component={google} />
            <Route exact path='/git' component = {git} />
            <Route exact path ='/inbox/:userid' component={inbox}/>
            <Route exact path='/project/:projectid' component={Project}/>
            <Route exact  path='/signup' component={Signup} />
            <Route exct path = '/sharescreen' component={ShareWindow}/>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
