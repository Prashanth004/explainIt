import React, { Component } from 'react'
import obj from './funccc'
import func from '../functions/testauth'

export default class componentName extends Component {
    constructor()
    {
        super();
        var d = func.testAuthentication()
        alert(d)
       
    }
  render() {
    return (
      <div>
        
      </div>
    )
  }
}
