import React, {Component} from 'react';
import './Login.css';
import InfoPlayer from '../InfoPlayer/InfoPlayer.js';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            token: this.props.token,
            loggedIn: this.props.token ? true : false
        };
    }

    render() {
        return (
            <div className = "Login">
                {!this.props.token && <a href='http://localhost:8888/login'> Login to Spotify </a>}
                {this.state.loggedIn && <InfoPlayer token = {this.state.token} />}
            </div>
        )
    }
}

export default Login;