import React, {Component} from 'react';
import './ArtistFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class ArtistFeatures extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            artist_tracks: [],
            artist_related: []
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.getArtistTopTracks()
            this.getArtistRelatedArtists()
            this.setState({
                display: true
            });
        }.bind(this), 1250)
    }

    getArtistTopTracks() {
        spotifyApi.getArtistTopTracks(this.props.playback.artist_id, "US")
            .then((response) => {
                console.log(response, 'artist tracks')
                let arr = [];
                for(let i = 0; i < response.tracks.length; i++) {
                    arr.push([response.tracks[i], i+1])
                }
                this.setState({
                    artist_tracks: arr
                });
            })
    }

    getArtistRelatedArtists() {
        spotifyApi.getArtistRelatedArtists(this.props.playback.artist_id)
            .then((response) => {
                console.log(response, 'artist related')
                let arr = [];
                for(let i = 0; i < response.artists.length; i++) {
                    arr.push([response.artists[i], i + 1])
                }
                this.setState({
                    artist_related: arr
                });
            })
    }

    render() {
        return(
            <div>
                <div className = "Title"> Artist Features </div>
                <div>
                    <div className = "Title"> Other Popular Tracks By {this.props.playback.artist} </div>
                    <ol>
                        {this.state.artist_tracks.map(
                            track => (
                                <li key = {track[1]}>
                                    {track[0].name}
                                </li>
                            )
                        )}
                    </ol>
                </div>
                <div>
                    <div className = "Title"> Other Artists like {this.props.playback.artist} </div>
                    <ol>
                        {this.state.artist_related.map(
                            artist => (
                                <li key = {artist[1]}>
                                    {artist[0].name}
                                </li>
                            )
                        )}
                    </ol>
                </div>
            </div>
        )
    }
}

export default ArtistFeatures;