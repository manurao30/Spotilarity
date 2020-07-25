import React, {Component} from 'react';
import './ArtistFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
import play from '../../pictures/play.svg';

const spotifyApi = new SpotifyWebApi();

class ArtistFeatures extends Component{
    constructor(props) {
        super(props);
        this.state = {
            display: false,
            selected: true,
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
        this.interval = setInterval(() => this.tick(), 100000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        if(this.props.new_song) {
            this.getArtistTopTracks()
            this.getArtistRelatedArtists()
        }
    }

    select() {
        this.state.selected ? this.setState({selected: false}) : this.setState({selected: true})
    }

    getArtistTopTracks() {
        spotifyApi.getArtistTopTracks(this.props.playback.artist_id, "US")
            .then((response) => {
                console.log(response, 'artist tracks')
                let arr = [];
                for(let i = 0; i < response.tracks.length; i++) {
                    arr.push([response.tracks[i]])
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
                    arr.push([response.artists[i]])
                }
                this.setState({
                    artist_related: arr
                });
            })
    }

    render() {
        return(
            <div>
                <div className = "Line">
                    {this.state.selected ? <button className = "Dropdown Left-Content" onClick = {() => this.select()}> ^ </button>
                    : <button className = "Dropdown Left-Content" onClick = {() => this.select()}> v </button>}
                    <div className = "Title"> Artist Features </div>
                </div>
                {this.state.selected && 
                    <div className = "Left-Content">
                        <div className = "Title"> Other Popular Tracks by {this.props.playback.artist} </div>
                        <div className = "Artist-Features-Container">
                                {this.state.artist_tracks.map(
                                    track => (
                                        <div className = "Artist-Container Green" onClick = {() => window.open(track[0].uri, "_blank")}>
                                            <div className = "Artist-Row">
                                                {<img src = {track[0].album.images[2].url} className = "Artist-Image"/>}
                                                <div className = "Artist-Column">
                                                    <div className = "Artist-Info"> {track[0].name} </div>
                                                    <div className = "Artist-Info Popularity-Info"> Popularity: {track[0].popularity} </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                        <div className = "Title"> Other Artists like {this.props.playback.artist} </div>
                        <div className = "Artist-Features-Container">
                                {this.state.artist_related.map(
                                    artist => (
                                        <div className = "Artist-Container" onClick = {() => window.open(artist[0].uri, "_blank")}>
                                            <div className = "Artist-Row">
                                                {<img src = {artist[0].images.length == 0 ? {play} : artist[0].images[2].url} className = "Artist-Image" />}
                                                <div className = "Artist-Column">
                                                    <div className = "Artist-Info Orange">{artist[0].name} </div>
                                                    <div className = "Artist-Info Orange Popularity-Info">Popularity: {artist[0].popularity} </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default ArtistFeatures;