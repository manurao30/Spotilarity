import React, {Component} from 'react';
import './Features.css';
import SpotifyWebApi from 'spotify-web-api-js';
import RadarChart from 'react-svg-radar-chart';
import play from '../../pictures/play.svg';
import { Slider } from '@material-ui/core';

const spotifyApi = new SpotifyWebApi();

class Features extends Component {
    constructor(props){
        super(props);
        this.state = {
            response: this.props.playback,
            audio_data: {
                danceability: 0,
                energy: 0,
                valence: 0,
                acousticness: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0
            },
            display: false,
            selected_audio: false,
            tracks: [],
            selected_albums: false,
            selected_artist: false,
            selected_tracks: false,
            selected_related: false,
            selected_recommendations: false,
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
            this.getAudioAnalysis()
            this.getTracksInAlbum()
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
            this.getAudioAnalysis();
            this.getTracksInAlbum();
            this.getArtistTopTracks();
            this.getArtistRelatedArtists();
            this.getArtist();
        }
    }

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.props.playback.track_id)
            .then((response) => {
                console.log(response, 'audio analysis')
                this.setState({
                    audio_data: 
                    {
                        danceability: response.danceability,
                        energy: response.energy,
                        valence: response.valence,
                        acousticness: response.acousticness,
                        instrumentalness: response.instrumentalness,
                        liveness: response.liveness,
                        speechiness: response.speechiness
                    }
                });
            })
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

    select_audio() {
        this.state.selected_audio ? this.setState({selected_audio: false}) : this.setState({selected_audio: true})
    }

    select_album() {
        this.state.selected ? this.setState({selected: false}) : this.setState({selected: true})
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

    select_recommendations() {
        this.state.selected_recommendations ? this.setState({selected_recommendations: false}) : this.setState({selected_recommendations: true})
    }

    render() {
        const audio_caps = {
            danceability: 'Danceability',
            energy: 'Energy',
            valence: 'Valence',
            acousticness: 'Acousticness',
            instrumentalness: 'Instrumentalness',
            liveness: 'Liveness',
            speechiness: 'Speechiness'
          };

        const audio_dataset = {
            data: {
                danceability: this.state.audio_data.danceability,
                energy: this.state.audio_data.energy,
                valence: this.state.audio_data.valence,
                acousticness: this.state.audio_data.acousticness,
                instrumentalness: this.state.audio_data.instrumentalness,
                liveness: this.state.audio_data.liveness,
                speechiness: this.state.audio_data.speechiness
            },
            meta: {color: '#5680E9'}
        }

        const audio_datas = [audio_dataset]

        return (
            <div className = "Features-Container"> 
                <div className = "BG-1">
                    <div className = "Line">
                        {this.state.selected_audio ? <button className = "Dropdown BG-1" onClick = {() => this.select_audio()}> ^ </button>
                        : <button className = "Dropdown BG-1" onClick = {() => this.select_audio()}> v </button>}
                        <div className = "Titles"> Audio Analysis </div>
                    </div>
                    {this.state.selected_audio && 
                    <div>
                        {this.state.display &&
                        <div className = "Flex Row">
                            <div className = "Radar-Chart"> 
                                <RadarChart data = {audio_datas} captions = {audio_caps} size = {400}/>
                            </div>
                            <div className = "Audio-Feature-List"> 
                                <div className = "Audio-Feature"> Danceability: {this.state.audio_data.danceability.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Energy: {this.state.audio_data.energy.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Valence: {this.state.audio_data.valence.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Acousticness: {this.state.audio_data.acousticness.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Instrumentalness: {this.state.audio_data.instrumentalness.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Liveness: {this.state.audio_data.liveness.toFixed(3)} </div>
                                <div className = "Audio-Feature"> Speechiness: {this.state.audio_data.speechiness.toFixed(3)} </div>
                            </div>
                        </div>
                        }
                    </div>
                    }
                </div>
                <div className = "BG-2">
                    <div className = "Line">
                        {this.state.selected ? <button className = "Dropdown-Album" onClick = {() => this.select_album()}> ^ </button>
                        : <button className = "Dropdown-Album" onClick = {() => this.select_album()}> v </button>}
                        <div className = "Titles"> Album Features </div>
                    </div>
                    {this.state.selected && 
                    <div className = "Album-Features-Container" >
                        {this.state.tracks.map(
                            track => (
                                <div onClick = {() => window.open(track.uri, "_blank")}>
                                    <div key = {track.track_number} className = "Album-Container">
                                        {track.name}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                }
                </div>
                <div className = "Line-Artist BG-3">
                    {this.state.selected_artist ? <button className = "Dropdown-Artist BG-3" onClick = {() => this.select_artist()}> ^ </button>
                    : <button className = "Dropdown-Artist BG-3" onClick = {() => this.select_artist()}> v </button>}
                    <div className = "Titles"> Artist Features </div>
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
                <div className = "Line-Artist BG-6">
                    {this.state.selected_recommendations ? <button className = "Dropdown-Artist BG-6" onClick = {() => this.select_recommendations()}> ^ </button>
                    : <button className = "Dropdown-Artist BG-6" onClick = {() => this.select_recommendations()}> v </button>}
                    <div className = "Right-Content Title-2"> Recommendations </div>
                </div>
                {this.state.selected_recommendations &&
                    <div>
                        <Slider />
                    </div>
                }
            </div>
        )
    }
}

export default Features;