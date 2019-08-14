import React from 'react';
import IssueCard from './issueCard';
import config from '../../../../config/config';
import CompactDesign from './compactDesign';

export default (props) => {
    const tweetWindow=(e) =>{
        var sharableURL = config.react_url + '/project/' + e.target.id;
        var text = "Discussions happened on explain";
        var encSharableURL = encodeURI(sharableURL);
        var encText = encodeURI(text);

        var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
        var width = 555,
            height = 300,
            top = window.innerHeight / 4,
            left = window.innerWidth / 4,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);

    }
    const recentpostText = (props.issueArray!==null)?(props.issueArray.length>0?(<p>Recent creations : </p>):(null)):(null)
    const issueItems =(props.issueArray!==null)?(props.issueArray.length>0?(props.issueArray.map((issue, index) => (
        <CompactDesign 
        key={index+1000}
        itsHome={(props.home === config.HOME)?true:false}
        socket={props.socket}
        tweetWindow={tweetWindow}
        issue={issue}
     />
    ))):(null)):(null)  
  return (
    <div>
      {recentpostText}
       {issueItems}
    </div>
  )
}
