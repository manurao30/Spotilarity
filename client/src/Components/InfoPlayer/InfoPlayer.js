import React, {Component} from 'react';
import './InfoPlayer.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class InfoPlayer extends Component {
    constructor(props){
      super(props);
      this.state = {
        loggedIn: this.props.token ? true : false,
        nowPlaying: { name: '', albumArt: '' },
        isPlaying: false,
        no_data: false,
        track_id: "",
        artist: "",
        artist_id: "",
        album: "",
        album_id: "",
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
                    console.log(response)
                    this.setState({
                        nowPlaying: {
                            name: response.item.name,
                            albumArt: response.item.album.images[0].url
                        },
                        isPlaying: response.is_playing,
                        track_id: response.item.id,
                        artist: response.item.artists[0],
                        artist_id: response.item.artists[0].id,
                        album: response.item.album,
                        album_id: response.item.album.id,
                        no_data: false
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

    skipToNext() {
        spotifyApi.skipToNext()
            .then((response) => {
                this.getNowPlaying()
            })
    }

    skipToPrevious() {
        spotifyApi.skipToPrevious()
            .then((response) => {
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

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.state.track_id)
            .then((response) => {
                console.log(response)
            })
    }

    getTracksInAlbum() {
        spotifyApi.getAlbumTracks(this.state.album_id)
            .then((response) => {
                console.log(response)
            })
    }

    getArtistTopTracks() {
        spotifyApi.getArtistTopTracks(this.state.artist_id, "US")
            .then((response) => {
                console.log(response)
            })
    }

    getArtistRelatedArtists() {
        spotifyApi.getArtistRelatedArtists(this.state.artist_id)
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return (
            <div>
                {!this.state.no_data && <div>
                    {this.state.loggedIn && <div>
                        Now Playing: {this.state.nowPlaying.name}
                    </div>}
                    <div>
                        <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
                    </div>
                    { this.state.loggedIn && <button onClick = {() => this.skipToPrevious()}> Previous </button> }
                    { this.state.loggedIn && (this.state.isPlaying ? <button onClick = {() => this.pause()}> Pause </button> : <button onClick = {() => this.play()}> Play </button>)}
                    { this.state.loggedIn && <button onClick = {() => this.skipToNext()}> Skip </button> }
                    { this.state.loggedIn && <button onClick = {() => this.getAudioAnalysis()}> Audio Analysis </button> }
                    { this.state.loggedIn && <button onClick = {() => this.getTracksInAlbum()}> Album Tracks </button> }
                    { this.state.loggedIn && <button onClick = {() => this.getArtistTopTracks()}> Artist Top </button> }
                    { this.state.loggedIn && <button onClick = {() => this.getArtistRelatedArtists()}> Artist Related </button> }
                </div> }
                {this.state.no_data && (
                    <p>
                        Please play something on your Spotify for something to be shown here!
                    </p>
                )}
                {this.state.no_data && console.log('Please play something on your Spotify for something to be shown here!')}
            </div>
        )
      }
}

export default InfoPlayer;