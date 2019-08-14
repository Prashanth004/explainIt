import React, { Component } from 'react'
import LandingWEb from './landing/landing';

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={reducedWidth : false}
    }
    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }
    resize(){
        this.setState({reducedWidth: window.innerWidth <= 700});
      }
  render() {
      return(<LandingWEb />)

  }
}
