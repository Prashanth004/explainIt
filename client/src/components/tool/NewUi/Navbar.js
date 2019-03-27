import React from 'react';

import { Link } from 'react-router-dom';
import config from '../../../config/config';
import PropType from 'prop-types';
import SearchBar from './Search'
import { connect } from 'react-redux';
import TwitterLogin from 'react-twitter-auth';
import Swal from 'sweetalert2';
import '../../css/nav.css'
import { stillAuthenicated, signout } from '../../../actions/signinAction';
import { signInWithGoogle, twitterAuthFailure, signInWithTwitter } from '../../../actions/signinAction';
import {openHome, openCreated, openParticipated} from '../../../actions/navAction'

class Navigationbar extends React.Component {
        constructor(props) {
            super(props);
            this.toggle = this.toggle.bind(this);
            this.state = {
              isOpen: false
            };
            this.googleResponse = this.googleResponse.bind(this);
            this.handleGit = this.handleGit.bind(this);
            this.openHome = this.openHome.bind(this);
            this.openParticipated = this.openParticipated.bind(this);
            this.openCreated = this.openCreated.bind(this);
        }
        showLogoutSuccess() {
            Swal.fire({
              type: 'success',
              title: 'Logout successful',
              timer: 1500,
              showConfirmButton: false,
            })
        }
        componentWillMount() {
          this.props.stillAuthenicated()
        }
        openParticipated(){
          this.props.openParticipated()
        }
        openCreated(){
          this.props.openCreated()
        }
        openHome(){
          if((window.location.pathname).length >1)
          window.open(config.react_url, '_self')
          else{
            this.props.openHome()
          }
         
        }

        handleGit() {
          var url = `https://github.com/login/oauth/authorize?client_id=${config.gitHubClientId}&scope=user&redirect_uri=${config.react_url_git}`
          window.open(url, '_self')
        }
        googleResponse(response) {
          const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken }, null, 2)], { type: 'application/json' });
          this.props.signInWithGoogle(tokenBlob)
        }

        toggle() {
          this.setState({
            isOpen: !this.state.isOpen
          });
        }
        render() {
          var centreNav = null
         var profileImage = (this.props.authAction) ?(!this.props.isAuthenticated)?(null):( <div className="dropdown">
         <div className="profileImagesDiv">
           <img className="profileImages" src={this.props.profilePic}></img>
         </div>
         <div className="dropdown-content">
           <button onClick={this.props.signout} className=" buttonLight navButton1"> Logout</button>
           <div className="imageLogout">
             <img onClick={this.props.signout} height="100%" width="100%" src={require('../../images/logout.png')} />
           </div>
         </div>
       </div>):(null)
          if (this.props.logoutSuccess) {
            this.showLogoutSuccess()
          }
          if(this.props.Created || this.props.Participated){
            var explainLogo = null
              centreNav =( <div className="navgation">
                  <div onClick={this.openCreated} className="normalNav">
                    <button onCick={this.openCreated} className="noButtons"><a>Created</a></button>
                  </div>
                  <div className="logo">
                  <button onClick={this.openHome} className="noButtons"><a>Explain</a></button>
                  </div>
                  <div onClick={this.openParticipated}className="normalNav">
                  <button className="noButtons"><a>Participated</a></button>
                  </div>
                </div>)
          }else{
            var explainLogo=( <p onClick={this.openHome}><a href="#">Explain</a></p>)
          }
          const content =(<div className="navBar">
            <div className="logo">
            {explainLogo}
           
          </div>
              <div >
               {centreNav}

              </div>
              <div className="navItem">
                <div>

                </div>
                <div></div>
                <div >
                  <SearchBar />
                </div>
                <div>
                {profileImage}
                </div>

              </div>
            </div>)

          return (
            <div>
              {content}
            </div>
          );
        }
      }

      Navigationbar.PropType = {
          stillAuthenicated: PropType.func.isRequired,
          signout: PropType.func.isRequired,
          signInWithGoogle: PropType.func.isRequired,
          signInWithTwitter: PropType.func.isRequired,
          twitterAuthFailure: PropType.func.isRequired,
          openHome:PropType.func.isRequired,
          openCreated :PropType.func.isRequired,
          openParticipated : PropType.func.isRequired

      };
      const mapStateToProps = state => ({
          isAuthenticated: state.auth.isAuthenticated,
          userName: state.auth.userName,
          profilePic: state.auth.profilePic,
          logoutSuccess: state.auth.logoutSuccess,
          userId: state.auth.id,
          Home : state.nav.openHome,
          Created : state.nav.openCreated,
          Participated :state.nav.openParticipated,
          authAction: state.auth.authAction,


})
export default connect(mapStateToProps, { signInWithTwitter,openHome, openCreated, openParticipated, twitterAuthFailure, stillAuthenicated, signInWithGoogle, twitterAuthFailure, signInWithTwitter, signout })(Navigationbar)
