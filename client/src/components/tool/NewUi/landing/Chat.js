import React from 'react';
import './chat.css';
import Chatright from './chatbubbleRight';
import Chatleft from './chatbubbleleft';

export default () => {
  return (
    <div>
      <Chatright chatText="What is Explain ?"/>
      <Chatleft chatText="Explain is a simple tool that allows screen-share/recording functionality within the browser, with some additional features ( talk to us, please)"/>
      <Chatright chatText="Why Explain?"/>
      <Chatleft chatText="There is a lot of explanation happening on a daily basis, within a team, between 2 remote workers, between employees within a company. What if these interactions were recorded and kept in order for reference for our future use. Explain helps you to do that with convenience.
"/>
      <Chatright chatText="Can you show me the sample workflow?"/>
      <Chatleft chatText="Yeah Sure , here check this below"/>
      <Chatright chatText="What is explain roadmap?"/>
      <Chatleft chatText="Explain wants to connect creators/tinkerers/part timers/subject matter experts to users who need help immediately. Of course we want the helpers earn for their time."/>
      <Chatleft chatText="Example: Imagine you are on stackoverflow, code is there, what if someone really explains it online to you, give you a clear understanding, and the helper is rewarded for his time."/>
      <Chatleft chatText="We want to work with creators/tinkerers , help them gain more mileage, invent tools / apps that help them focus on creations, by giving them support systems that value their time and skillset."/>
      <Chatleft chatText="Lets get started!!!"/>
    
     
    </div>
  )
}
