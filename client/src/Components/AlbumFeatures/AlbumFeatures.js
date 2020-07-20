import React, {Component} from 'react';
import './AlbumFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class AlbumFeatures extends Component{
    constructor(props){
        super(props);
        this.state = {
            tracks: [],
            display: false
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.getTracksInAlbum()
            this.setState({
                display: true
            });
        }.bind(this), 1250)
    }

    getTracksInAlbum() {
        spotifyApi.getAlbumTracks(this.props.playback.album_id)
            .then((response) => {
                console.log(response, 'album features')
                let arr = [];
                for(let i = 0; i < response.items.length; i++) {
                    arr.push(response.items[i])
                }
                this.setState({
                    tracks: arr
                });
            })
    }

    render() {
        return(
            <div>
                <div className = "Title"> Album Features </div>
                <ol>
                    {this.state.tracks.map(
                        track => (
                            <li key = {track.track_number}>
                                {track.name}
                            </li>
                        )
                    )}
                </ol>
            </div>
        )
    }
}

export default AlbumFeatures;