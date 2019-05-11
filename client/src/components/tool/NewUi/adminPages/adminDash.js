import React from 'react'
import DashboardComponent from './DashBoardEle'


export default (props) => {
        const userDiv = props.details.map((user, index)=>(
           <DashboardComponent user={user}/>))
      return (
        <div>
             <div className="AdminDashboard Head">
               <div>
                   <p><b>Name</b></p>
               </div>
               <div>
                   <p><b>Email</b></p>
               </div>
               <div>
                   <p><b>Date</b></p>
               </div>
               <div>
                   <p><b>Activation Status</b></p>
               </div>
           </div>
          {userDiv}
        </div>
      )
      
}


