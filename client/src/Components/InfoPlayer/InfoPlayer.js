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
        },
        new_song: true
      }
    }

    getNowPlaying() {
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                if(!response) {
                    this.setState({
                        no_data: true
                    });
                } else if (response.item.name === this.state.playback.name){
                    this.setState({
                        new_song: false
                    });
                } else {
                    console.log(response, 'get now playing')
                    this.setState({
                        playback: 
                        {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url,
                            isPlaying: response.is_playing,
                            track_id: response.item.id,
                            artist: response.item.artists[0].name,
                            artist_id: response.item.artists[0].id,
                            album: response.item.album.name,
                            album_id: response.item.album.id,
                            loggedIn: true,
                            no_data: false,
                            popularity: response.item.popularity
                        },
                        new_song: true
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
        <div>
            {!this.state.no_data && 
                <div className = "row">
                    <div className = "player"> {this.state.playback.loggedIn && <Player playback = {this.state.playback}/> } </div>
                    <div className = "features"> {this.state.playback.loggedIn && <Features playback = {this.state.playback} new_song = {this.state.new_song}/> } </div> 
                </div>}
            {this.state.no_data && (<p> Please play something on your Spotify for something to be shown here!</p>)}
        </div>

        )
      }
}

export default InfoPlayer;