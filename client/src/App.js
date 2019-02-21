import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Home from './components/Home.js'
import Question from './components/Question'
import Login from './components/Login'
import Signup from './components/Signup'
import Newlogin from './components/Newlogin'
import Newhome from './components/newLanding'
import Explainit from './components/Explainit'
import google from './components/testGoogle'
import DisplayShare from './components/tool/displayScreenshare'
import entireScreenShare from './components/tool/shareEntireScreen'
import git from './components/git'
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
          <Route path ="/connect/:callerid" component= {DisplayShare}/>
            <Route path ="/"  exact component={Newhome}/>
            <Route path ="/question/:id" component={Question}/>
            <Route exact  path='/login' component={Login} />
            <Route exact  path='/newlogin' component={Newlogin} />
            <Route exact  path='/newhome' component={Newhome} />
            <Route exact  path='/explainIt' component={Explainit} />
            <Route exact  path='/google' component={google} />
            <Route exact path='/git' component = {git} />
            <Route exact path='/entire' component= {entireScreenShare} />
            {/* <Route exact path='/projects' component={Projects}/> */}
            <Route exact  path='/signup' component={Signup} />
            {/* <Route path ="/" component={}/> */}
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
