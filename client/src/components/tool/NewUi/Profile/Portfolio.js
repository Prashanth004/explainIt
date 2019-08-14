import React, { Component } from 'react';
import axios from 'axios';
import config from '../../../../config/config'

export default class componentName extends Component {
    constructor(props){
        super(props)
        this.state={project:null}
    }
    componentWillMount(){
      
        var token = JSON.parse(localStorage.getItem('token'));
        var projectid =this.props.match.params.projectid;
        axios({
            method: 'get',
            url: config.base_dir + '/api/project/issues/' + projectid,
            headers: {
                "Authorization": token,
            }
        }).then((response) => {
            this.setState({
                project: response.data.data[0]
            })
           
        })
    }
  render() {
    return (this.state.project!==null?(
      <div style={{minheight:"98vh"}}>
          <div style={{paddingTop:"20px",textAlign:"center"}}>
              <video src={this.state.project.videofilepath} autoPlay controls></video>
          </div>
        
      </div>
    ):(null))
  }
}
