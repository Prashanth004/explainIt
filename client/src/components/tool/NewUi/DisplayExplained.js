import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import '../../css/newlanding.css';
import { getDetailsOfExplained } from '../../../actions/issueActions';
import axios from 'axios'
import config from '../../../config/config'
 class DisplayExplained extends Component {
    constructor(props){
        super(props)
        this.state={
           
            showAllPeople : false
        }
        this.openProfile = this.openProfile.bind(this)
        }

  
    openProfile(e){
        // window.open(config.react_url+'/explainIt', "_blank")
       var twitter = this.props.DetailsOfPeople.filter(a=>a.projectid===e.target.id)
       console.log("twitter : ", twitter)
       window.open(config.react_url+'/profile/'+twitter[0].twitterhandle, "_blank")

    }
  
  render() {
      console.log("details of people : ",this.props.DetailsOfPeople)
    var limitPeople = this.props.DetailsOfPeople.slice(0,config.peopleDisplayLength)
    var countElement = null;
    var allPeopleImages = null;
    if(this.state.showAllPeople){
        // allPeopleImages = ()
    //     this.props.DetailsOfPeople.map((people,index)=>(
    //         <div >
    //         <div key ={people.projectid}className="singleMember">
    //                <div id={people.projectid} onClick={this.openProfile}className="imagePeopleDiv">
    //                <span>
    //                    <img id={people.projectid} width="100%" height="100%"src={people.profilepic} className="peopleImage"/>
    //                 </span>
    //                </div>
    //                <span id={people.projectid} onClick={this.props.changeVideo} className="peopleName">
    //                    {people.username}
    //                </span>
    //            </div>
    //            </div>
    // ))
    }
    else{
        allPeopleImages = null;
    }
   
    if(this.props.DetailsOfPeople.length >config.peopleDisplayLength){
        var noOfPeople = (this.props.DetailsOfPeople.length)-config.peopleDisplayLength
        countElement = (!this.props.showAllPeople)?(<p>+{noOfPeople}</p>):
        (null)
    }
       
      var images= (!this.props.showAllPeople)?(limitPeople.map((People,index)=>(
                    <div id={this.props.issueid}  className="imagePeopleDiv">
                    <span>
                            <img id="imageOfPeople" src={People.profilepic} className="peopleImage"></img>
                            </span>
                        </div>
      ))):(null)
    return (
      <div id={this.props.issueid} className="displayPeople">
           <div id={this.props.issueid} onClick={this.props.toggleAllPeopleList}className="likes">
                       {images}
                    <div id={this.props.issueid} className="numberOfPeople">
                             {countElement}                      
                    </div>
            </div>
           <div className="">
           {/* {allPeopleImages} */}
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



