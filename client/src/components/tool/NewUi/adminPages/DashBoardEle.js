import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../../../../config/config'
import {deactivateUser,activateUser} from '../../../../actions/adminAction'
class DashboardEle extends Component {
    constructor(props) {
        super(props)
        this.state={btnText:"Deactivate", status:"Active"}
        super(props)
        this.activateUser = this.activateUser.bind(this);
        this.deactivateUser = this.deactivateUser.bind(this);
        this.tweetInvite = this.tweetInvite.bind(this)
    }
    componentWillMount(){
        this.setState({
            btnText :Number(this.props.user.activation)?"Deactivate":"Activate",
            status : Number(this.props.user.activation)?"Active":"Inactive"
        })
     
    }
    tweetInvite(e){
        var sharableURL = config.react_url + '/signin/@' + this.props.user.twitterhandle;
        var text = 'Hi @'+this.props.user.twitterhandle+', we are happy to inform you that application explain is ready to serve you. Signup using this link below';
        var encSharableURL = encodeURI(sharableURL);
        var encText = encodeURI(text);

        var href = "https://twitter.com/intent/tweet?text=" + encText + "&url=" + encSharableURL
        var width = 555,
            height = 300,
            top = window.innerHeight / 4,
            left = window.innerWidth / 4,
            url = href,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;
        window.open(url, 'twitter', opts);
        this.setState({btnText:"Deactivate",status:"Active"})
        this.props.activateUser(e.target.id, this.props.username, this.props.password)

    }
    
    activateUser(e){
        this.setState({btnText:"Deactivate",status:"Active"})
        this.props.activateUser(e.target.id, this.props.username, this.props.password)
    }
    deactivateUser(e){
        this.setState({btnText:"Activate",status:"Inactive"})
        this.props.deactivateUser(e.target.id, this.props.username, this.props.password)
    }
    render() {
        const user = this.props.user
        return (
            <div className="AdminDashboard" key={user.id}>
                <div>
                    <p><b>{user.username}</b></p>
                </div>
                <div>
                    <p>{user.twitterhandle}</p>
                </div>
                <div>
                    <p>{user.email}</p>
                </div>
                <div>
                    <span>{user.date.slice(11, 20)}</span>
                </div>
                <div>
                    <span>{this.state.status}</span>
                </div>
                <div>
                    <button id={user.id} disabled={Number(!user.activation)}
                        onClick={Number(user.activation) ?(this.deactivateUser) :
                            (this.tweetInvite)}>{this.state.btnText}</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = function (state) {
    return {
        username: state.admin.userName,
        password: state.admin.password
    }
}

export default connect(mapStateToProps, { activateUser, deactivateUser })(DashboardEle);


