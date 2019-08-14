import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store';
import ReactGA from 'react-ga';
import landing from './components/tool/NewUi/landingPgae'
import config from './config/config';
import InternetSpeed from './components/tool/NewUi/container/testInternet'
import ScreenShareFloater from './components/tool/NewUi/NewFloater/screenShareControl'
import Login from './components/tool/NewUi/Login';
import adminDash from './components/tool/NewUi/adminPages/adminroot'
import NoMatch from './components/tool/NewUi/NoMatch'
import Home from './components/tool/NewUi/HomePages/homeRoute'
import Feedback from './components/tool/NewUi/feedback/feedback'
// import video from './components/tool/NewUi/videoDisplay'
import Explainit from './components/tool/NewUi/Explain/ExplainPage'
import Portfolio from './components/tool/NewUi/Profile/Portfolio.js'
import google from './components/testGoogle';
import Toggle from './components/tool/NewUi/NewFloater/closeFloater'
import DisplayShare from './components/tool/displayScreenshare'
import Project from './components/Project'
import newNav from './components/tool/NewUi/newNav/index'
import git from './components/git'
import Acticities from './components/tool/NewUi/Posts'
import Info from './components/tool/NewUi/NewFloater/info'
import inbox from './components/tool/NewUi/Inbox';
import Setting from './components/tool/NewUi/newNav/setting'
import VideoDisplay from './components/VideoDisplay';
import ChatInitiate from './components/tool/NewUi/chat/index'
// import floater from './components/tool/NewUi/Floater/floater'
import DetailsIsueView from './components/tool/NewUi/DisplayDetailProject';
import savedItems from './components/tool/NewUi/Floater/savedIssues'
class App extends Component {
  componentWillMount() {
    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
}
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
          <Switch>
          <Route path ="/share/:callerid" component= {DisplayShare}/>
          <Route path ="/share/newuser/:twitterhandle/:callerid" component= {DisplayShare}/>
            <Route exact path = "/setting" component={Setting}/>
            <Route path="/screenShareFloater" component={ScreenShareFloater}/>
            <Route exact path='/signin/:twitterhandle' component={Login} />
            <Route exact path='/explainIt' component={Explainit} />
            <Route exact path='/google' component={google} />
            <Route exact path='/git' component = {git} />
            <Route exact path ='/inbox/:userid' component={inbox}/>
            <Route exact path = "/chat" component = {ChatInitiate}/>
            <Route exact path='/project/:projectid' component={Project}/>
            <Route exact path = '/admindash' component={adminDash} />
            <Route exact path = '/video/:projectid' component={VideoDisplay} />
            <Route exact path = '/feedback' component = {Feedback}/>
            <Route exact path = "/saveditems" component={savedItems}/>
            <Route exact path = '/' component = {landing}/>
            <Route exact path = '/closefloater' component = {Toggle}/>
            <Route exact path = '/testspeed' component={InternetSpeed}/>
            <Route exact path = "/issue/:issueid" component={DetailsIsueView}/>
            <Route exact path = "/info" component = {Info} />
            <Route exact path = '/newNav' component = {newNav} />
            <Route exact path ='/portfolio/:projectid' component={Portfolio}/>
            {/* <Route exact path = "/activities" component = {Acticities} /> */}
            <Route exact path = "/:encrTwitterHandle/activities"component = {Acticities}/>
            <Route exact path = "/:encrTwitterHandle"component = {Home}/>
            
            <Route component={NoMatch} />
          
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
