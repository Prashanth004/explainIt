 import axios from 'axios'
 import config from '../config/config'

 const func ={
 testAuthentication : function(){
   var answer = 0
   alert(" i am in testAuthentication")
 let token = JSON.parse(localStorage.getItem('token'));
  if(token){
  axios.get(config.base_dir+'/users/', { headers: {
    "Authorization"  :  token,
  }}).then(response =>{
    // alert(response.status)
    if(response.status===200 || response.status===304)
    answer =  1
    else{ 
      localStorage.removeItem("token");
    
      answer = 0
    }
    return answer
  })
}
else{
answer = 0
}
// return answer
 }
}

export default func