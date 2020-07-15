import React, {Component} from 'react';
import './ArtistFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class ArtistFeatures extends Component{

    getArtistTopTracks() {
        spotifyApi.getArtistTopTracks(this.props.playback.artist_id, "US")
            .then((response) => {
                console.log(response)
            })
    }

    getArtistRelatedArtists() {
        spotifyApi.getArtistRelatedArtists(this.props.playback.artist_id)
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return(
            <div>
                <button onClick = {() => this.getArtistTopTracks()}> Artist Top </button>
                <button onClick = {() => this.getArtistRelatedArtists()}> Artist Related </button> 
            </div>
        )
    }
}

export default ArtistFeatures;