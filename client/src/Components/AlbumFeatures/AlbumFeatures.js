import React, {Component} from 'react';
import './AlbumFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class AlbumFeatures extends Component{

    getTracksInAlbum() {
        spotifyApi.getAlbumTracks(this.props.playback.album_id)
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return(
            <div>
                <button onClick = {() => this.getTracksInAlbum()}> Album Tracks </button>
            </div>
        )
    }
}

export default AlbumFeatures;