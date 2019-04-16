import React, { Component } from 'react'
import config from '../../../config/config'
import InputBox from './InputBox';
import { FiSave, FiX,FiSend} from "react-icons/fi";
import { connect } from 'react-redux';
import TweetSendMessage from './TweetSendMessage'



class SaveProjects extends Component {
    constructor(props){
        super(props)
        this.state={
            limitExce:false,
            empty:false,
            limitOfChar:null,
            textValue:null,
            privatePublic : false,
            callRecText:"Call",
            sendMessageClicked:false,
            enteredSubjest:false,
            tweetStarted:false
        }
        this.changeInputValue = this.changeInputValue.bind(this);
        this.savefilePu = this.savefilePu.bind(this);
        this.savefilePri = this.savefilePri.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.markTweetStarted = this.markTweetStarted.bind(this)
    }

    markTweetStarted(){
        this.setState({
            tweetStarted:true
        })
    }
    componentDidMount(){
        if(this.props.shareOrRec === config.RECORDING){
            this.setState({
                callRecText:"recording"
            })
        }
        else{
            this.setState({
                callRecText:"Call"
            })
        }
        this.setState({
            limitOfChar:config.PROJECT_TEXT_LIMIT
        })     
    }
    savefilePu(){

        if(this.state.textValue!==null){
            if((this.state.textValue).length > 0)
            {
            this.setState({
                privatePublic:true
            })
            this.props.savefilePublic(this.state.textValue)
        }
            else{
                this.setState({
                    empty:true 
                })
            }
        }else{
            this.setState({
                empty:true 
            })
        }
    }
    sendMessage(){
        
        this.props.sendButtonClick()
        this.setState({
            sendMessageClicked:true
        })
    }
    savefilePri(){
        if(this.state.textValue!==null){
            if((this.state.textValue).length > 0){
        this.props.savefilePrivate(this.state.textValue)
        this.setState({
            privatePublic:true
        })
    }
        else{
            this.setState({
                empty:true 
            })
        }
    }else{
        this.setState({
            empty:true 
        })
    }
    }
  
    changeInputValue(e){
      var textValuetemp = this.state.textValue
        if(textValuetemp!==null && textValuetemp.length > this.state.limitOfChar){
            this.setState({
                limitExce:true
            })
        }
        else{
            this.setState({
                limitExce:false
            })
        }
    
        this.setState({
            textValue : e.target.value,
            empty:false
        })

    }
  render() {
      const saveOption=(this.props.twitterUserId===null)?(
        <span className="hint--bottom" aria-label="Save Recording">
        <FiSave className="icons" onClick={this.props.saveClicked} />
    </span>
      ):(null)
      const subjectInoutBox=((this.props.showInputBox)?(<InputBox 
        limitExce={this.state.limitExce}
        empty={this.state.empty}
        limitOfChar={this.state.limitOfChar}
        changeInputValue={this.changeInputValue}
        textValue={this.state.textValue}
        />):(null) )
    const tweetSendMessage = (this.props.fromShareToRecord
    )?(<div style={{textAlign:"center"}}>
            <button onClick={this.savefilePri} className="buttonDark">Send Recording</button>
             </div>):( <TweetSendMessage
            sendRecording={this.savefilePri}
             />)
    // const tweetSendMessage2 =()
        
    return  (!this.props.isSaveClicked && !this.state.sendMessageClicked)?
    (<div>
        <p>Do you want to save the {this.state.callRecText}?</p>
       <span className="hint--bottom" aria-label="Send Recording">
           <FiSend className="icons" onClick={this.sendMessage} />
       </span>
       {saveOption}
        <span className="hint--bottom" aria-label="Cancel">
            <FiX className="icons" onClick={this.props.closeImidiate} />
        </span>
    </div>):
    ((this.state.sendMessageClicked)?(
        // this.state.enteredSubjest?(
            <div>
          {subjectInoutBox}
           {tweetSendMessage}
           {/* <TweetSendMessage
            sendRecording={this.savefilePri}
             /> */}
            </div>
            
        // ):(null)
    
    
    
    ):
    
    ((this.state.privatePublic)?(<div><p>saving..</p></div>):(
    <div style={{width:"70%",
    margin:"auto"}}>
        <InputBox 
       limitExce={this.state.limitExce}
       empty={this.state.empty}
       limitOfChar={this.state.limitOfChar}
       changeInputValue={this.changeInputValue}
       textValue={this.state.  textValue}
       />
       {/* <h8>Your privacy is important to use</h8> */}
       <button className="buttonDark" onClick={this.savefilePri}
       style={{marginTop:"30px"}}>Save</button>
   </div>))
   )
  }
}


SaveProjects.PropType = {
   
};
const mapStateToProps = state => ({
    isSaved: state.issues.successCreation,
    showInputBox:state.message.showTextAftRec,
    twitterUserId: state.twitterApi.twitterId,
    fromShareToRecord:state.message.fromShareToRecord
})

export default connect(mapStateToProps, { })(SaveProjects)



