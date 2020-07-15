import React, {Component} from 'react';
import './Player.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            isPlaying: this.props.playback.isPlaying,
            render: false
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.setState({render: true, isPlaying: this.props.playback.isPlaying}) //After 1 second, set render to true
        }.bind(this), 400)
    }

    skipToNext() {
        spotifyApi.skipToNext();
        window.location.reload();
    }

    skipToPrevious() {
        spotifyApi.skipToPrevious();
        window.location.reload();
    }

    pause() {
        spotifyApi.pause()
        this.setState({
            isPlaying: false
        })
    }

    play() {
        spotifyApi.play()
        this.setState({
            isPlaying: true
        })
    }

    render() {
        return (
            <div> 
                <div> 
                    <div> {this.props.playback.name} </div>
                    <div> <img src={this.props.playback.albumArt} style={{ height: 150 }}/> </div>
                    <button onClick = {() => this.skipToPrevious()}> Previous </button>
                    {this.state.render && (this.state.isPlaying ? <button onClick = {() => this.pause()}> Pause </button> : <button onClick = {() => this.play()}> Play </button>)}
                    <button onClick = {() => this.skipToNext()}> Skip </button>
                </div>
            </div>
        )
    }
}

export default Player;