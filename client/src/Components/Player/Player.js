import React, {Component} from 'react';
import './Player.css';
import previous from '../../../src/pictures/previous.svg';
import next from '../../../src/pictures/next.svg';
import play from '../../../src/pictures/play.svg';
import pause from '../../../src/pictures/pause.svg';
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
            this.setState({
                render: true, 
                isPlaying: this.props.playback.isPlaying
            }) //After 1 second, set render to true
        }.bind(this), 400)
        
    }

    skipToNext() {
        spotifyApi.skipToNext();
    }

    skipToPrevious() {
        spotifyApi.skipToPrevious();
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
                    <div className = "Name"> {this.props.playback.name} </div>
                    <div className = "Artist"> {this.props.playback.artist} </div>
                    <div> <img src={this.props.playback.albumArt} className = "Picture"/> </div>
                    <div className = "Album"> {this.props.playback.album} </div>
                    <button className = "Border" onClick = {() => this.skipToPrevious()}> <img src = {previous} className = "Button"/> </button>
                    {this.state.render && (this.state.isPlaying ? <button className = "Border" onClick = {() => this.pause()}> <img src = {pause} className = "Button"/> </button> : <button className = "Border" onClick = {() => this.play()}> <img src = {play} className = "Button"/> </button>)}
                    <button className = "Border" onClick = {() => this.skipToNext()}> <img src = {next} className = "Button"/> </button>
                </div>
            </div>
        )
    }
}

export default Player;