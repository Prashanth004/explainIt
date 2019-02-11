import React, { Component } from 'react'
import Navbar from './Navbar'
import './css/project.css'
import config from '../config/config'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { Container, Row, Col, Div } from 'reactstrap'

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesUrl: [],
            toHome: false
        }
        this.setProjId = this.setProjId.bind(this);


    }

    componentDidMount() {
        var token = JSON.parse(localStorage.getItem('token'));
        // alert(token)
        axios({
            method: 'get',
            url: config.base_dir + '/project',
            headers: {
                "Authorization": token,
            },

        }).then(response => {
            var projId = []
            if (response.status === 200) {
                // alert("successfull")
                var data = response.data
                var imgArr = []
                data.forEach(element => {
                    axios({
                        method: 'get',
                        url: config.base_dir + '/project/images/' + element.projectid,
                        headers: {
                            "Authorization": token,
                        },


                    }).then(images => {


                        this.setState({

                            imagesUrl: [...this.state.imagesUrl, images.data]
                        })
                    })
                        .catch(err => {
                            console.log(err)
                        })

                });

            }

        })
            .catch(err => {
                alert(err)
                console.log("err :" + err)
            }
            )

    }
    generateLink(event) {
        alert(config.react_url + '/edit/' + event.target.id)
    }


    setProjId(event) {
        //    alert(event.target.id)
        localStorage.setItem('projectID', event.target.id)
        this.setState({
            toHome: true
        })


    }
    render() {
        if (this.state.toHome === true) {
            return <Redirect to='/create' />
        }


        const imgur = this.state.imagesUrl.map((imgs, i) => (
            <div>
                <div class="text">
                    <p>{imgs[0].name}</p>
                </div >
                <div class="finecard">

                    <div class="backgorund">
                        <div key={imgs[0].projectid} className="card">
                            <img onClick={this.setProjId} id={imgs[0].projectid} src={imgs[0].imgurl} className="imgs" crossOrigin="anonymous" />
                        </div>
                        <i class="glyphicon glyphicon-share" id={imgs[0].projectid} onClick={this.generateLink}></i>
                        <div class="btn">
                            <button class="shrBtn" >ShareLink</button>
                            <button class="dltBtn" id={imgs[0].projectid}>Delete</button>

                        </div>
                    </div>
                </div>
            </div>
        ))



        return (

            <div class="backgorund">


                <Navbar />
                <div>
                    <div className="wrapper">

                        {imgur}

                    </div>
                </div>
            </div>



        )
    }
}


export default Projects;
