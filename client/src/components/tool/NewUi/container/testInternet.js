import React, { Component } from 'react'

export default class TestInternet extends Component {
    constructor(props){
        super(props);
        this.state={
            speedBps:'',
                speedKbps:'',
                speedMbps:'',
                test:false
        }
    }

    componentDidMount(){
        var imageAddr = "https://explain.bookmane.in/public/images/sample.jpg";
        var startTime, endTime;
        var downloadSize = 2000000;
        var download = new Image();
        download.onload = function () {
            endTime = (new Date()).getTime();
            showResults();
        }
        startTime = (new Date()).getTime();
        download.src = imageAddr;
        var self = this;
        
        function showResults() {
            var duration =((endTime - startTime) / 1000);
            var bitsLoaded = downloadSize *8;
            var speedBps = Math.round(bitsLoaded / duration);
            var speedKbps = (speedBps / 1024).toFixed(2);
            var speedMbps = (speedKbps / 1024).toFixed(2);
            self.setState({test:true,
                speedBps:speedBps,
                speedKbps:speedKbps,
                speedMbps:speedMbps
            })
            // alert("Your connection speed is: \n" + 
            //        speedBps + " bps\n"   + 
            //        speedKbps + " kbps\n" + 
            //        speedMbps + " Mbps\n" );
        }
    }
  render() {
    return (!this.state.test)?(
      <div>
       <p>testing...</p>
      </div>
    ):(<div>
        <p>speedBps : {this.state.speedBps}</p>
        <p>speedKbps : {this.state.speedKbps}</p>
        <p>speedMbps : {this.state.speedMbps}</p>
    </div>)
  }
}
