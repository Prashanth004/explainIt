

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
    return (!this.state.timeOut)? (<div><h5>
      <b>Call ended due to network issues</b>
  </h5>
      <p>Please wait.. Caller maight retry to call you </p>
  </div>):(<div><h5>
            <b>Call ended due to network issues</b>
            <p>Caller did not retry</p>
        </h5>
           
        </div>)

  }
}


