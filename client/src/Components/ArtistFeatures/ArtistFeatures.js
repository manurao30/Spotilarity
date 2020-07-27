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
            selected_artist: true,
            selected_tracks: true,
            selected_related: true,
            artist_tracks: [],
            artist_related: [],
            artist_info: {
                name: '',
                pic: '',
                popularity: 0,
                followers: 0,
                uri: '',
                genres: []
            }
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.getArtistTopTracks()
            this.getArtistRelatedArtists()
            this.getArtist()
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

    select_artist() {
        this.state.selected_artist ? this.setState({selected_artist: false}) : this.setState({selected_artist: true})
    }

    select_tracks() {
        this.state.selected_tracks ? this.setState({selected_tracks: false}) : this.setState({selected_tracks: true})
    }

    select_related() {
        this.state.selected_related ? this.setState({selected_related: false}) : this.setState({selected_related: true})
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

    getArtist() {
        spotifyApi.getArtist(this.props.playback.artist_id)
            .then((response) => {
                console.log(response, 'artist response')
                this.setState({
                    artist_info: {
                        name: response.name,
                        pic: response.images[0].url,
                        popularity: response.popularity,
                        followers: response.followers.total,
                        uri: response.uri,
                        genres: response.genres
                    }
                })
            })
    }

    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }

    render() {
        return(
            <div>
                <div className = "Line-Artist BG-3">
                    {this.state.selected_artist ? <button className = "Dropdown-Artist BG-3" onClick = {() => this.select_artist()}> ^ </button>
                    : <button className = "Dropdown-Artist BG-3" onClick = {() => this.select_artist()}> v </button>}
                    <div className = "Title"> Artist Features </div>
                </div>
                {this.state.selected_artist && 
                <div>
                    <div className = "BG-3">
                        <div className = "Flex Row Margin-2">
                            <div className = "Artist-Info-2 Column"> 
                                <div className = "Artist-Name"> {this.state.artist_info.name} </div>
                                <div onClick = {() => window.open(this.state.artist_info.uri)}> <img src = {this.state.artist_info.pic} className = "Artist-Pic"/> </div>
                            </div>
                            <div className = "Artist-Info-Container">
                                <div className = "Artist-Popularity"> Popularity: {this.state.artist_info.popularity} </div>
                                <div className = "Artist-Followers"> {this.numberWithCommas(this.state.artist_info.followers)} Spotify Followers </div>
                                <div className = "Header-3"> Genres </div>
                                <div className = "Flex Row Wrap Center-Content Width-2">
                                {this.state.artist_info.genres.map(
                                    genre => (
                                        <div className = "Artist-Genres-Header Artist-Genres"> {this.capitalize(genre)} </div>
                                    )
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
                <div className = "Line-Artist BG-4">
                    {this.state.selected_tracks ? <button className = "Dropdown-Artist BG-4" onClick = {() => this.select_tracks()}> ^ </button>
                    : <button className = "Dropdown-Artist BG-4" onClick = {() => this.select_tracks()}> v </button>}
                    <div className = "Right-Content Title-2"> Popular Tracks by {this.props.playback.artist} </div>
                </div>
                {this.state.selected_tracks &&
                    <div className = "BG-4">
                        <div className = "Artist-Features-Container Row">
                                {this.state.artist_tracks.map(
                                    track => (
                                        <div className = "Artist-Container Green Box-Shadow-1" onClick = {() => window.open(track[0].uri, "_blank")}>
                                            <div className = "Artist-Row">
                                                {<img src = {track[0].album.images[2].url} className = "Artist-Image"/>}
                                                <div className = "Artist-Column Column">
                                                    <div className = "Artist-Info"> {track[0].name} </div>
                                                    <div className = "Artist-Info Popularity-Info"> Popularity: {track[0].popularity} </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                    </div>
                }
                <div className = "Line-Artist BG-5">
                    {this.state.selected_related ? <button className = "Dropdown-Artist BG-5" onClick = {() => this.select_related()}> ^ </button>
                    : <button className = "Dropdown-Artist BG-5" onClick = {() => this.select_related()}> v </button>}
                    <div className = "Right-Content Title-2"> Other Artists like {this.props.playback.artist} </div>
                </div>
                {this.state.selected_related &&
                    <div className = "BG-5">
                        <div className = "Artist-Features-Container">
                                {this.state.artist_related.map(
                                    artist => (
                                        <div className = "Artist-Container Box-Shadow-1" onClick = {() => window.open(artist[0].uri, "_blank")}>
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