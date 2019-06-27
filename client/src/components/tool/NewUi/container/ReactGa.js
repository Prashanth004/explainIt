import ReactGA from 'react-ga';
import config from '../../../../config/config'

export const  initGA =()=>{
	console.log("GA init");
	ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
}
export const loadPageView=()=>{
	ReactGA.set({page:window.location.pathname});
	ReactGA.pageview(window.lcation);
}	
	
