import React, {Component} from 'react';
import './NowPlaying.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class NowPlaying extends Component {
    constructor(props){
      super(props);
      if(this.props.token) {
        spotifyApi.setAccessToken(this.props.token);
        this.getNowPlaying()
      }
      this.state = {
        loggedIn: this.props.token ? true : false,
        nowPlaying: { name: '', albumArt: '' },
        isPlaying: false
      }
    }

    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                console.log(response)
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url,
                        isPlaying: response.is_playing
                    }
                });
            })
    }

    skipToNext() {
        spotifyApi.skipToNext()
            .then((response) => {
                console.log(response)
                this.getNowPlaying()
            })
    }

    skipToPrevious() {
        spotifyApi.skipToPrevious()
            .then((response) => {
                console.log(response)
                this.getNowPlaying()
            })
    }

    pause() {
        spotifyApi.pause()
        this.setState({
            isPlaying: false
        });
    }

    play() {
        spotifyApi.play()
        this.setState({
            isPlaying: true
        });
    }

    render() {
        return (
            <div>
                {this.state.loggedIn && <div>
                    Now Playing: {this.state.nowPlaying.name}
                </div>}
                <div>
                    <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
                </div>
                { this.state.loggedIn && <button onClick = {() => this.skipToPrevious()}> Previous </button> }
                { this.state.loggedIn && (this.state.isPlaying ? <button onClick = {() => this.pause()}> Pause </button> : <button onClick = {() => this.play()}> Play </button>)}
                { this.state.loggedIn && <button onClick = {() => this.skipToNext()}> Skip </button> }
            </div>
        )
      }
}

export default NowPlaying;