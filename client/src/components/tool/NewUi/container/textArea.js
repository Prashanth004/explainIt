import React, { Component } from 'react';
import '../../../css/ProfileForm.css';

const spanStyle={
  fontSize:"10px",
  alignSelf:"right",
  textAlign:"right",
  float:"right",
  color:"#333",
  fontWeight:"200",
  marginTop:"-5px",
  zIndex:"1000"

}

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={limitOfChar : 100, presentLength:0, updatedLimitValues:false};
        this.OnInput = this.OnInput.bind(this);
        this.changeText = this.changeText.bind(this);
    }
    componentWillMount(){
      if(this.props.textvalue!==undefined  && this.props.limit!== undefined){
        this.setState({presentLength : (this.props.limit - this.props.textvalue.length)});
        this.setState({limitOfChar : this.props.limit,updatedLimitValues:true})
      }
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.textvalue || nextProps.limit){
        this.setState({presentLength : (nextProps.limit - nextProps.textvalue.length)});
      }
    }
    componentDidMount(){
        this.OnInput();
        var tx = document.getElementsByTagName('textarea');
        for (var i = 0; i < tx.length; i++) {
            tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
            tx[i].addEventListener("input", this.OnInput, false);
            tx[i].addEventListener("keyup", this.props.enterPress);
        }
    }
  changeText(e){
    this.setState({presentLength : (this.state.limitOfChar - this.props.textvalue.length)+1});
    this.props.changeFunction(e)
  }
    OnInput(){
        this.textArea.style.height = 'auto';
        this.textArea.style.height = (this.textArea.scrollHeight) + 'px';

    }
  render() {
    const {textvalue,inputClass,placeholder,textAlign} = this.props;
    const {updatedLimitValues,presentLength} = this.state;
    const characherDis = (updatedLimitValues && presentLength>=0)?(<span style={spanStyle}>{presentLength}</span>):(null)
    return (
      <div>
        <textarea
       
        rows = "auto"
        ref={a => this.textArea = a}
         value={textvalue}
        onChange={this.changeText}
         className={inputClass}
         placeholder={placeholder}
         style={{textAlign:textAlign}}  />
         {characherDis}
      </div>)
  }
}
