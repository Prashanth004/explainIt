import React from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';


class Posts extends React.Component {
    render(){
       
        return(
            <div>
                <Navbar />
                
            </div>
        )
    }
}
const mapStateToProps ={

}
export default connect(mapStateToProps,{})(Posts)