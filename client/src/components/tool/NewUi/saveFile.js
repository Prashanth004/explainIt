import {creatAnsProject} from '../../../actions/projectActions';
import { connect } from 'react-redux';

export const saveFile =  (isquestion,videoData, audioData, isPublic, text, action,issueId,props) => {
    var imgData = "null";
    var items = {}
    console.log("i am reaching here")
   props.creatAnsProject(text, imgData, videoData, audioData, items, isquestion, issueId, isPublic, action)
}
const mapStateToProps = function(state) {
    return {
    activities:state.call.activities,
    userId: state.auth.id,
    }
  }
  
  export default connect(mapStateToProps,{creatAnsProject})(saveFile);