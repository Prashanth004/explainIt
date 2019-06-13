import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import landing from './components/tool/NewUi/landingPgae'
import ScreenShareFloater from './components/tool/NewUi/NewFloater/screenShareControl'
// import emailvarify from './components/tool/NewUi/emailvarify'
import Login from './components/tool/NewUi/Login';
import adminDash from './components/tool/NewUi/adminPages/adminroot'
import NoMatch from './components/tool/NewUi/NoMatch'
import Home from './components/tool/NewUi/Home'
import video from './components/tool/NewUi/videoDisplay'
import Explainit from './components/tool/NewUi/Explain/ExplainPage'
import google from './components/testGoogle'
import DisplayShare from './components/tool/displayScreenshare'
import Project from './components/Project'
import visitProfile from './components/tool/NewUi/connectProfile'
import git from './components/git'
import Info from './components/tool/NewUi/NewFloater/info'
import inbox from './components/tool/NewUi/Inbox'
import floater from './components/tool/NewUi/Floater/floater'
import DetailsIsueView from './components/tool/NewUi/DisplayDetailProject';
import savedItems from './components/tool/NewUi/Floater/savedIssues'
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
          <Switch>
          <Route path ="/connect/:callerid" component= {DisplayShare}/>
            <Route exact path ="/application" component={Home}/>
            <Route path="/screenShareFloater" component={ScreenShareFloater}/>
            <Route exact  path='/signin/:twitterhandle' component={Login} />
            <Route exact  path='/explainIt' component={Explainit} />
            <Route exact  path='/google' component={google} />
            <Route exact path='/git' component = {git} />
            <Route exact path ='/inbox/:userid' component={inbox}/>
            <Route exact path='/project/:projectid' component={Project}/>
            <Route exact path = '/admindash' component={adminDash} />
            <Route exact path = '/video' component={video} />
            <Route exact path ='/floater' component={floater}/>
            <Route exact path = "/saveditems" component={savedItems}/>
            <Route exact path = '/' component = {landing}/>
            {/* <Route exaxt path ='/emailvarify' component={emailvarify}/> */}
            <Route exact path = "/issue/:issueid" component={DetailsIsueView}/>
            <Route exact path = "/info" component = {Info} />
            <Route exact path = "/:encrTwitterHandle"component = {visitProfile}/>
            <Route component={NoMatch} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
