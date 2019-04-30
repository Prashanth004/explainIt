import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import config from '../../../config/config'
import { connect } from 'react-redux';
import '../../css/Search.css';


class Search2 extends Component {
    constructor(props){
        super(props)
        this.state={
            value: '',
            selecctedId:null,
            searchDisable:true
        }
        this.handleChange =this.handleChange.bind(this)
        this.openSearched = this.openSearched.bind(this)
    }
    componentWillMount(){
        this.setState({
            value: '',
            selecctedId:null,
            searchDisable:true
        })
    }
    openSearched(){
        localStorage.setItem("issueId", this.state.selecctedId)
        window.open(config.react_url + '/project/'+this.state.selecctedId, "_blank")
    }
    matchStocks(state, value) {
        return (
            state.twitterhandle.toLowerCase().indexOf(value.toLowerCase()) !== -1 
            // state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    }
    selectValue=value => {
      this.props.onChange(null, value)
        
         
      
    }
    handleChange = (event, value) => {
      this.props.onChange(null, value)
    }
  

    render() {
        return (

            <div style={{ borderRadius:"5%", display:"inline" }}>
                <Autocomplete
                    className="inputTweet"
                    value={this.props.tweetTextvalue}
                    style={{ borderRadius:"5%", margin:"10px",padding:"5px" }}
                    inputProps={{
                         id: 'states-autocomplete',
                         className:this.props.classOfInput,
                         placeholder:this.props.placeholder
                         }}
                    wrapperProps={{ borderRadius:"5%",margin:"10px", padding:"5px" }}
                    wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                    items={this.props.twiterHandleArray}
                    getItemValue={item => item.twitterhandle}
                    shouldItemRender={this.matchStocks}
                    onChange={this.handleChange}
                    autoHighlight={true}
                    onSelect={this.selectValue}
                    renderMenu={children => (
                        <div className="menu">
                            {children}
                        </div>  
                    )}
                    renderItem={
                       (item, isHighlighted) => (null
                        // (item.lenght>0)?(
                        // <div
                        //     className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                        //     key={item.issueid} >
                        //     <p>{item.twitterhandle}</p>
                        // </div >
                        // )
                    )}
                />
               
            </div>
        );
    }
}


Search2.PropType = {
  

};
const mapStateToProps = state => ({
    projects : state.profile.myIssues,
    twiterHandleArray : state.twitterApi.twitterHandles
})
export default connect(mapStateToProps, {})(Search2)

