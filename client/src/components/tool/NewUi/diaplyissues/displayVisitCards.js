import React from 'react';
import IssueCard from './issueCard';
import config from '../../../../config/config';

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
    const issueItems =props.issueArray!==null?( props.issueArray.map((issue, index) => (
        <IssueCard 
        key={index+1000}
        itsHome={(props.home === config.HOME)?true:false}
        socket={props.socket}
        tweetWindow={tweetWindow}
        issue={issue}
     />
    ))):(null)  
  return (
    <div>
       {issueItems}
    </div>
  )
}
