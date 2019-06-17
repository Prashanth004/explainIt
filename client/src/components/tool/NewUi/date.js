import React from 'react'
import config from '../../../config/config'

const datStyleYear= {backgroundColor:"#34a9ad", 
color:"white",
padding:"3px",
fintWeight:"blod",
borderStyle:"solid",
borderWidth:"0.5px",
borderColor:"black"}


const datStyleDay = {
    fontSize:"18px",
    width:"35px",
    borderStyle:"solid",
    borderWidth:"0.5px",
    borderColor:"black",
    padding:"4px ",
   
    paddingBottom:"0px",
paddintTop:"0px"}
export default (props) => {
var date = props.date.slice(5, 7)
  return (
    <div>
       <div className="date">
                    <span style={datStyleYear}>{props.date.slice(8, 10)} {config.monthPicker[date]}</span>
                    <br />
                    <span style={datStyleDay}>{props.date.slice(0, 4)}</span>
                </div>
    </div>
  )
}
