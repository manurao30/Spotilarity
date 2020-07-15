import React, {Component} from 'react';
import './InfoPlayer.css';
import Player from '../Player/Player.js';
import Features from '../Features/Features.js';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class InfoPlayer extends Component {
    constructor(props){
      super(props);
      this.state = {
        playback: 
        { 
            name: '', 
            albumArt: '', 
            isPlaying: true,
            no_data: true,
            track_id: "",
            artist: "",
            artist_id: "",
            album: "",
            album_id: "", 
            loggedIn: this.props.token ? true : false,
        }
      }
    }

    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                if(!response) {
                    this.setState({
                        no_data: true
                    });
                } else {
                    console.log(response, 'toppp')
                    this.setState({
                        playback: 
                        {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url,
                            isPlaying: response.is_playing,
                            track_id: response.item.id,
                            artist: response.item.artists[0],
                            artist_id: response.item.artists[0].id,
                            album: response.item.album,
                            album_id: response.item.album.id,
                            loggedIn: true,
                            no_data: false
                        }
                    });
                }
            })
    }

    componentDidMount() {
        if(this.props.token) {
            spotifyApi.setAccessToken(this.props.token);
        }
        this.getNowPlaying();
        this.interval = setInterval(() => this.tick(), 100000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        if(this.props.token) {
          this.getNowPlaying();
        }
    }

    render() {
        return (
        <div class = "wrapper">
            {!this.state.no_data && <div class = "row">
                <div class = "player"> {this.state.playback.loggedIn && <Player playback = {this.state.playback}/> }</div>
                <div class = "features"> {this.state.playback.loggedIn && <Features playback = {this.state.playback}/> } </div> 
            </div>
            }
            {this.state.no_data && (<p> Please play something on your Spotify for something to be shown here!</p>)}
        </div>
        )
      }
}

export default InfoPlayer;