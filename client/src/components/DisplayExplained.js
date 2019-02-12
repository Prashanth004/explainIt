import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import './css/newlanding.css'
import { getDetailsOfExplained } from '../actions/issueActions';
import axios from 'axios'
import config from '../config/config'
 class DisplayExplained extends Component {
    constructor(props){
        super(props)
        this.state={
            DetailsOfPeople : []
        }
    }
    componentWillMount(){
        var self = this;
       
        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method:'get',
            url:config.base_dir+'/project/issues/'+self.props.issueid,
            headers: {
                "Authorization": token,
            }
    
        }).then((response)=>{
           
            if(response.status === 200){
                var allProjects = response.data.data
                var answerProject = allProjects.filter(project => project.isquestion !="true")
                answerProject.forEach(function(projects, index){
                    axios({
                        method:'get',
                        url:config.base_dir+'/users/email/'+projects.email,
    
                    }).then(response=>{
                        console.log("final response: ", response)
                        if(response.status==200){
                        const newTestJson = JSON.parse(JSON.stringify(answerProject));
                        newTestJson[index]['profilepic']=response.data.data.profilepic;
                        newTestJson[index]['username']=response.data.data.username;
                        answerProject =newTestJson
                        console.log(answerProject)
                        self.setState({
                            DetailsOfPeople:answerProject
                        })
                        }
                    })
                    .catch(err=>{
                        console.log("error : ",err)
                    })
                })
               
              
            }
    
        })
        .catch((error)=>{
    
        })
    }
  render() {
    //   console.log(this.state.DetailsOfPeople)
      var images= this.state.DetailsOfPeople.map((People,index)=>(
                    <div  className="imagePeopleDiv">
                            <img id="imageOfPeople" src={People.profilepic} className="peopleImage"></img>
                        </div>
      ))
    return (
      <div>
           <div className="likes">
                       {images}
                    </div>
      </div>
    )
  }
}

DisplayExplained.PropType = {
    getDetailsOfExplained : PropType.func.isRequired
   
};
const mapStateToProps = state => ({
   
})

export default connect(mapStateToProps, { getDetailsOfExplained })(DisplayExplained)



