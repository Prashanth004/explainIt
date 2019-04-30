import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropType from 'prop-types';
import '../../css/newlanding.css';
import { getDetailsOfExplained } from '../../../actions/issueActions';
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
       var twitter = this.props.DetailsOfPeople.filter(a=>a.projectid===e.target.id)
       window.open(config.react_url+'/profile/'+twitter[0].twitterhandle, "_blank")

    }
  
  render() {
    var limitPeople = this.props.DetailsOfPeople.slice(0,config.peopleDisplayLength)
    var countElement = null;
  
   
    if(this.props.DetailsOfPeople.length >config.peopleDisplayLength){
        var noOfPeople = (this.props.DetailsOfPeople.length)-config.peopleDisplayLength
        countElement = (!this.props.showAllPeople)?(<p>+{noOfPeople}</p>):
        (null)
    }
       
      var images= (!this.props.showAllPeople)?(limitPeople.map((People,index)=>(
                    <div id={this.props.issueid} key={this.props.projectid}  className="imagePeopleDiv">
                    <span>
                            <img alt="people" id="imageOfPeople" src={People.profilepic} className="peopleImage"></img>
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



