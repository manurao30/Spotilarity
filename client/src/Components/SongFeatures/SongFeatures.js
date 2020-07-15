import React, {Component} from 'react';
import './SongFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class SongFeatures extends Component{

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.props.playback.track_id)
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return(
            <div>
                <button onClick = {() => this.getAudioAnalysis()}> Audio Analysis </button> 
            </div>
        )
    }
}

export default SongFeatures;