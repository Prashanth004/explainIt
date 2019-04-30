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
            state.textexplain.toLowerCase().indexOf(value.toLowerCase()) !== -1 
            // state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    }
    selectValue=value => {
      var issue =(this.props.projects)
        this.setState({
             value,
            
            })
        var b = issue.filter(a=>
                a.textexplain === value
        )
      if(b.length>0){
        this.setState({
            selecctedId:b[0].issueid,
            searchDisable:false
        })
      }
       
         
      
    }
    handleChange = (event, value) => {
        this.setState({ value,
            searchDisable:true })
    }
  

    render() {
        return (

            <div style={{ width:"100%", borderRadius:"5%", marginLeft:"60%", display:"inline" }}>
                <Autocomplete
                    className="input"
                    value={this.state.value}
                    inputProps={{
                         id: 'states-autocomplete',
                         className:'inputtext'
                         }}
                    wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                    items={this.props.projects}
                    getItemValue={item => item.textexplain}
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
                       (item, isHighlighted) => (
                        // (item.lenght>0)?(
                        <div
                            className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                            key={item.issueid} >
                            <p>{item.textexplain}</p>
                        </div >
                        // )
                    )}
                />
                <button 
                disabled={this.state.searchDisable}
                onClick={this.openSearched}
                className="buttonLight">Search</button>
            </div>
        );
    }
}


Search2.PropType = {
  

};
const mapStateToProps = state => ({
    projects : state.profile.myIssues

})
export default connect(mapStateToProps, {})(Search2)







// import _ from 'lodash'
// // import faker from 'faker'
// import React, { Component } from 'react'
// // import PropType from 'prop-types';
// import { connect } from 'react-redux';
// import { Search, Grid, Header, Segment } from 'semantic-ui-react'

// // const source = _.times(5, () => ({
// //   title: faker.company.companyName(),
// //   description: faker.company.catchPhrase(),
// //   image: faker.internet.avatar(),
// //   price: faker.finance.amount(0, 100, 2, '$'),
// // }))

// class SearchExampleStandard extends Component {
//     constructor(props){
//         super(props)

//         this.resetComponent = this.resetComponent.bind(this)
//         this.handleResultSelect = this.handleResultSelect.bind(this)
//         this.handleSearchChange = this.handleSearchChange.bind(this)
//     }
//   componentWillMount() {
//     this.resetComponent()
//   }

//   resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

//   handleResultSelect = (e, { result }) => this.setState({ value: result.textexplain })

//   handleSearchChange = (e, { value }) => {
//     this.setState({ isLoading: true, value })

//     setTimeout(() => {
//       if (this.state.value.length < 1) return this.resetComponent()

//       const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
//       const isMatch = result => re.test(result.textexplain)

//       this.setState({
//         isLoading: false,
//         results: _.filter(this.props.source, isMatch),
//       })
//     }, 300)
//   }

//   render() {
//     const { isLoading, value, results } = this.state

//     return (
//       <Grid>
//         <Grid.Column width={6}>
//           <Search
//             loading={isLoading}
//             onResultSelect={this.handleResultSelect}
//             onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
//             results={results}
//             value={value}
//             {...this.props}
//           />
//         </Grid.Column>
//         {/* <Grid.Column width={10}>
//           {/* <Segment>
//             <Header>State</Header>
//             <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
//             <Header>Options</Header>
//             <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.props.source, null, 2)}</pre>
//           </Segment> */}
//         {/* </Grid.Column> */} 
//       </Grid>
//     )
//   }
// }
// SearchExampleStandard.PropType = {


// };
// const mapStateToProps = state => ({

//    source : state.profile.myIssues
// })

// export default connect(mapStateToProps, {})(SearchExampleStandard)



