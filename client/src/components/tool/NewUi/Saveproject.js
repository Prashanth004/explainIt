import React, { Component } from 'react'
import config from '../../../config/config'
import InputBox from './InputBox';
import { FiSave, FiX} from "react-icons/fi";
import { connect } from 'react-redux';



class SaveProjects extends Component {
    constructor(props){
        super(props)
        this.state={
            limitExce:false,
            empty:false,
            limitOfChar:null,
            textValue:null,
            privatePublic : false,
            callRecText:"Call"
        }
        this.changeInputValue = this.changeInputValue.bind(this);
        this.savefilePu = this.savefilePu.bind(this);
        this.savefilePri = this.savefilePri.bind(this);
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
                if ((this.state.textValue).length < 201) {
                    this.setState({
                        privatePublic: true
                    })
                    this.props.savefilePublic(this.state.textValue)
                }
                else {
                    this.setState({
                        limitExce: true
                    })
                }
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
    savefilePri(){
        if(this.state.textValue!==null){
            if((this.state.textValue).length > 0){
         if ((this.state.textValue).length < 201) {

                    this.props.savefilePrivate(this.state.textValue)
                    this.setState({
                        privatePublic: true
                    })
                }
                else {
                    this.setState({
                        limitExce: true
                    })
                }
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
    return  (!this.props.isSaveClicked)?
    (<div>
        <p>Do you want to save the {this.state.callRecText}?</p>
       
        <span className="hint--top" aria-label="Save">
            <FiSave className="icons" onClick={this.props.saveClicked} />
        </span>
        <span className="hint--bottom" aria-label="Cancel">
            <FiX className="icons" onClick={this.props.closeImidiate} />
        </span>
    </div>):
    ((this.state.privatePublic)?(<div><p>saving..</p></div>):(<div>
        <InputBox 
       limitExce={this.state.limitExce}
       empty={this.state.empty}
       limitOfChar={this.state.limitOfChar}
       changeInputValue={this.changeInputValue}
       textValue={this.state.textValue}
       />
       {/* <h8>Your privacy is important to use</h8> */}
       <button className="buttonDark" onClick={this.savefilePu}>Public</button>
       <button className="buttonDark" onClick={this.savefilePri}>Private</button>
   </div>))
  }
}


SaveProjects.PropType = {
   
};
const mapStateToProps = state => ({
    isSaved: state.issues.successCreation,
})

export default connect(mapStateToProps, { })(SaveProjects)



