import React, {Component} from 'react';
import './Login.css';
import InfoPlayer from '../InfoPlayer/InfoPlayer.js';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false
        };
    }

    render() {
        return (
            <div>
                {!this.props.token && <a href='http://localhost:8888/login'> Login to Spotify </a>}
                <InfoPlayer token = {this.props.token} />
            </div>
        )
    }
}

export default Login;