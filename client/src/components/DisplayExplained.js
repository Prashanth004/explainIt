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
            DetailsOfPeople : [],
            showAllPeople : false
        }
        this.toggleAllPeopleList = this.toggleAllPeopleList.bind(this)
        this.openProfile = this.openProfile.bind(this)
        }

    toggleAllPeopleList(){
        this.setState({
            showAllPeople : !this.state.showAllPeople
        })
    }
    openProfile(e){
        // window.open(config.react_url+'/explainIt', "_blank")
    //    window.open(config.react_url+'/profile/'+e.target.id, "_blank")
    }
    componentWillMount(){
        var self = this;
       
        var token = JSON.parse(localStorage.getItem('token'))
        axios({
            method:'get',
            url:config.base_dir+'/api/project/issues/'+self.props.issueid,
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
                        url:config.base_dir+'/api/users/email/'+projects.email,
                    }).then(response=>{
                        console.log("final response: ", response)
                        if(response.status==200){
                        const newTestJson = JSON.parse(JSON.stringify(answerProject));
                        newTestJson[index]['profilepic']=response.data.data.profilepic;
                        newTestJson[index]['username']=response.data.data.username;
                        newTestJson[index]['id']=response.data.data.id
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
    var limitPeople = this.state.DetailsOfPeople.slice(0,config.peopleDisplayLength)
    var countElement = null;
    var allPeopleImages = null;
    if(this.state.showAllPeople){
        allPeopleImages = this.state.DetailsOfPeople.map((people,index)=>(
            <div className="listOfAllPeople">
            <div key ={people.id}className="singleMember">
                   <div id={people.id} onClick={this.openProfile}className="imagePeopleDiv">
                       <img id={people.id} width="100%" height="100%"src={people.profilepic} className="peopleImage"/>
                   </div>
                   <p id={people.id} onClick={this.openProfile} className="peopleName">
                       {people.username}
                   </p>
               </div>
               </div>
    ))
    }
    else{
        allPeopleImages = null;
    }
   
    if(this.state.DetailsOfPeople.length >config.peopleDisplayLength){
        var noOfPeople = (this.state.DetailsOfPeople.length)-config.peopleDisplayLength
        countElement = (<p>+{noOfPeople}</p>)
    }
        console.log("limitPeople : ",limitPeople)
      var images= limitPeople.map((People,index)=>(
                    <div id={this.props.issueid}  className="imagePeopleDiv">
                            <img id="imageOfPeople" src={People.profilepic} className="peopleImage"></img>
                        </div>
      ))
    return (
      <div id={this.props.issueid} className="displayPeople">
           <div id={this.props.issueid} onClick={this.toggleAllPeopleList}className="likes">
                       {images}
                    <div id={this.props.issueid} className="numberOfPeople">
                             {countElement}                      
                    </div>
            </div>
           
               {allPeopleImages}
           
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



