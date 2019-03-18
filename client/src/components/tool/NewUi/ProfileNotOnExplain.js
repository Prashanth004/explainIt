import React, { Component } from 'react'
import config from '../../../config/config'

export default class componentName extends Component {

    constructor(props){
        super(props)
        this.state={

        }
        this.SendInvite = this.SendInvite.bind(this)
    }
    closeWindow(){
        window.location.close()
    }
   SendInvite(e){

        
    var textToBeDisplayed = "@"+this.props.twitterhandle+" Simplest way to share your screen. Better way to explain your thoughts. Get started now. Click on the link."
    var Url = config.react_url
    var encSharableURL =  encodeURI(Url);
    var encText = encodeURI(textToBeDisplayed);
  
    
    var linkToBeShared= "https://twitter.com/intent/tweet?text="+encText+"&url="+encSharableURL;
    // var linkToBeShared= "https://twitter.com/messages/compose?recipient_id="+props.twitterId
    // +this.props.twitterId.button+"&text="+encText+"&url="+encSharableURL;


            var sharableURL =config.react_url + '/project/' + this.props.twitterhandle;
            var text = "Discussions happened on explain";
            var encSharableURL =  encodeURI(sharableURL);
            var encText = encodeURI(text);
           
            var href="https://twitter.com/intent/tweet?text="+encText+"&url="+encSharableURL
            var width  = 555,
                height = 300,
                top = window.innerHeight/4,
                left=window.innerWidth/4,
                url    = linkToBeShared,
                opts   = 'status=1' +
                         ',width='  + width  +
                         ',height=' + height +
                         ',top='    + top    +
                         ',left='   + left;
            window.open(url, 'twitter', opts);
            
           }

    
  render() {
    return (
      <div>
      <div className="displayInvite">
                 <div className="inviteContainer">
                     <h3>Looks like this person hasn't registered with Bookmane</h3>
                     <div className="inviteMagic">
                         <h4>May be he can add lot of value being here</h4>
                         <h4>Would you help him to know?</h4>
                         <button className="buttonDark twitterBtn"
                       onClick={this.SendInvite}><i class="fa fa-twitter twitterBtn">  Invite</i></button>
                     </div>
                 </div>
             </div>
      </div>
    )
  }
}





// import React from 'react'
// import config from '../../../config/config'

// export default (props) => {


//     }
    
//     var textToBeDisplayed = "Simplest way to share your screen. Better way to explain your thoughts. Get started now. Click on the link below."
//     var Url = config.react_url
//     var encSharableURL =  encodeURI(Url);
//     var encText = encodeURI(textToBeDisplayed);
    
//     var linkToBeShared= "https://twitter.com/intent/tweet?via="+props.twitterhandle+"text"+encText+"&url="+encSharableURL;
//     // var linkToBeShared= "https://twitter.com/messages/compose?recipient_id="+props.twitterId
//     // +this.props.twitterId.button+"&text="+encText+"&url="+encSharableURL;

//   return (
     
//     <div>
      
//       <div className="displayInvite">
//                  <div className="inviteContainer">
//                      <h3>Looks like this person hasn't registered with Bookmane</h3>
//                      <div className="inviteMagic">
//                          <h4>May be he can add lot of value being here</h4>
//                          <h4>Would help him to know?</h4>
//                          <a className="buttonDark" href={linkToBeShared}> Invite</a>
//                          <button className="buttonLight">Not now</button>
//                      </div>
//                  </div>
//              </div>
//     </div>
//   )
// }

