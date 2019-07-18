
import React, { Component } from 'react'

export default class componentName extends Component {
  constructor(props){
    super(props);
    this.state=({timeOut:false})
    }
    componentDidMount(){
      setTimeout(()=>{
        this.setState({timeOut:true})
    },10000)
    }
  render() {
    return (!this.state.timeOut)?(<div><p>Preparing a link to access the call..</p>
    </div>):(<div><br/><p>Could not generate Link right now.</p>
        <p>Please check your activities section, get the link of the session</p></div>)

  }
}


