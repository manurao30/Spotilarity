import React, {Component} from 'react';
import './Features.css';
import SpotifyWebApi from 'spotify-web-api-js';
import RadarChart from 'react-svg-radar-chart';
import Toggle from 'react-toggle';
import { Slider } from '@material-ui/core';
import play from '../../pictures/play.svg';

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
            selected_albums: false,
            selected_artist: false,
            selected_tracks: false,
            selected_related: false,
            selected_recommendations: true,
            tracks: [],
            artist_tracks: [],
            artist_related: [],
            artist_info: {
                name: '',
                pic: '',
                popularity: 0,
                followers: 0,
                uri: '',
                genres: []
            },
            recommendation_limit: 1,
            recommendation_seed_artists: this.props.playback.artist_id,
            recommendation_seed_tracks: this.props.playback.track_id,
            recommendation_market: "US",
            recommendation_target_danceability: 69,
            recommendation_target_energy: 65,
            recommendation_target_valence: 50,
            recommendation_target_acousticness: 24,
            recommendation_target_instrumentalness: 0,
            recommendation_target_liveness: 10,
            recommendation_target_speechiness: 16,
            recommendation_target_popularity: this.props.playback.popularity,
            recommendations_name: '',
            recommendations_popularity: '',
            recommendations_uri: ''
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
            console.log('poooop')
        }
    }

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.props.playback.track_id)
            .then((response) => {
                console.log(response, 'audio analysis')
                this.setState({
                    audio_data: 
                    {
                        danceability: response.danceability * 100,
                        energy: response.energy * 100,
                        valence: response.valence * 100,
                        acousticness: response.acousticness * 100,
                        instrumentalness: response.instrumentalness * 100,
                        liveness: response.liveness * 100,
                        speechiness: response.speechiness * 100
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
                    },
                    recommendation_seed_artists: response.id,
                    recommendation_seed_tracks: this.props.playback.track_id,
                    recommendation_target_popularity: this.props.playback.popularity
                })
            })
    }

    getRecommendations(options) {
        spotifyApi.getRecommendations(options)
            .then((response) => {
                console.log(response, 'recommendations')
                let arr = []
                for(let i = 0; i < response.tracks.length; i++) {
                    arr.push(response.tracks[i])
                }
                console.log('arr', arr)
                this.setState({
                    recommendations: arr
                });
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
        this.state.selected_albums ? this.setState({selected_albums: false}) : this.setState({selected_albums: true})
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

    handleDanceability = (event, newValue) => {
        this.setState({
            recommendation_target_danceability: newValue
        });
    }

    handleEnergy = (event, newValue) => {
        this.setState({
            recommendation_target_energy: newValue
        });
    }

    handleValence = (event, newValue) => {
        this.setState({
            recommendation_target_valence: newValue
        });
    }

    handleAcousticness = (event, newValue) => {
        this.setState({
            recommendation_target_acousticness: newValue
        });
    }

    handleInstrumentalness = (event, newValue) => {
        this.setState({
            recommendation_target_instrumentalness: newValue
        });
    }

    handleLiveness = (event, newValue) => {
        this.setState({
            recommendation_target_liveness: newValue
        });
    }

    handleSpeechiness = (event, newValue) => {
        this.setState({
            recommendation_target_speechiness: newValue
        });
    }

    handlePopularity = (event, newValue) => {
        this.setState({
            recommendation_target_popularity: newValue
        });
    }

    handleMarket = (event) => {
        this.setState({recommendation_market: event.target.value});
    }

    handleLimit = (event) => {
        this.setState({recommendation_limit: event.target.value})
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
                danceability: this.state.audio_data.danceability / 100,
                energy: this.state.audio_data.energy / 100,
                valence: this.state.audio_data.valence / 100,
                acousticness: this.state.audio_data.acousticness / 100,
                instrumentalness: this.state.audio_data.instrumentalness / 100,
                liveness: this.state.audio_data.liveness / 100,
                speechiness: this.state.audio_data.speechiness / 100
            },
            meta: {color: '#5680E9'}
        }

        const audio_datas = [audio_dataset]

        const recommendation_options = {
            limit: this.state.recommendation_limit,
            seed_artists: this.state.recommendation_seed_artists,
            seed_tracks: this.state.recommendation_seed_tracks,
            market: this.state.recommendation_market,
            target_danceability: this.state.recommendation_target_danceability,
            target_energy: this.state.recommendation_target_energy,
            target_valence: this.state.recommendation_target_valence,
            target_acousticness: this.state.recommendation_target_acousticness,
            target_instrumentalness: this.state.recommendation_target_instrumentalness,
            target_liveness: this.state.recommendation_target_liveness,
            target_speechiness: this.state.recommendation_target_speechiness,
            target_popularity: this.state.recommendation_target_popularity
        }

        const marks = [
            { value: 0, label: '0'},
            { value: 100, label: '100'}
        ]

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
                                <div className = "Audio-Feature Yellow"> Popularity : {this.props.playback.popularity} </div>
                                <div className = "Audio-Feature"> Danceability: {this.state.audio_data.danceability.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Energy: {this.state.audio_data.energy.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Valence: {this.state.audio_data.valence.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Acousticness: {this.state.audio_data.acousticness.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Instrumentalness: {this.state.audio_data.instrumentalness.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Liveness: {this.state.audio_data.liveness.toFixed(1)} </div>
                                <div className = "Audio-Feature"> Speechiness: {this.state.audio_data.speechiness.toFixed(1)} </div>
                            </div>
                        </div>
                        }
                    </div>
                    }
                </div>
                <div className = "BG-2">
                    <div className = "Line">
                        {this.state.selected_albums ? <button className = "Dropdown-Album" onClick = {() => this.select_album()}> ^ </button>
                        : <button className = "Dropdown-Album" onClick = {() => this.select_album()}> v </button>}
                        <div className = "Titles"> Album Features </div>
                    </div>
                    {this.state.selected_albums && 
                    <div className = "Album-Features-Container" >
                        {this.state.tracks.map(
                            (track, index) => (
                                <div onClick = {() => window.open(track.uri, "_blank")}>
                                    <div key = {index} className = "Album-Container Orange">
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
                                <div onClick = {() => window.open(this.state.artist_info.uri)}> <img src = {this.state.artist_info.pic} alt = "Artist Pic" className = "Artist-Pic"/> </div>
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
                                                {<img src = {track[0].album.images[2].url} alt = "Artist Pic" className = "Artist-Image"/>}
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
                                                {<img src = {artist[0].images.length === 0 ? {play} : artist[0].images[2].url} alt = "Artist Pic" className = "Artist-Image" />}
                                                <div className = "Artist-Column">
                                                    <div className = "Artist-Info Related-Text">{artist[0].name} </div>
                                                    <div className = "Artist-Info Related-Text Popularity-Info">Popularity: {artist[0].popularity} </div>
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
                    <div className = "BG-6">
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Danceability </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_danceability}
                                onChange = {this.handleDanceability}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Energy </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_energy}
                                onChange = {this.handleEnergy}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Valence </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_valence}
                                onChange = {this.handleValence}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Acousticness </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_acousticness}
                                onChange = {this.handleAcousticness}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Instrumentalness </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_instrumentalness}
                                onChange = {this.handleInstrumentalness}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Liveness </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_liveness}
                                onChange = {this.handleLiveness}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Speechiness </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                value = {this.state.recommendation_target_speechiness}
                                onChange = {this.handleSpeechiness}
                            />
                        </div>
                        <div className = "Slider-Container">
                            <div className = "Recommendation-Title"> Popularity </div>
                            <Slider 
                                valueLabelDisplay="on"
                                marks = {marks}
                                defaultValue = {60}
                                onChange = {this.handlePopularity}
                            />
                        </div>
                        <div className = "Slider-Container Flex">
                            <div className = "Option-Container">
                                <div className = "Recommendation-Title Align-Center"> Market </div>
                                <form>
                                    <select value={this.state.recommendation_market} onChange={this.handleMarket} className = "select-css">
                                        <option value = "US">United States</option>
                                        <option value = "AU">Australia</option>
                                        <option value = "BE">Belgium</option>
                                        <option value = "BR">Brazil</option>
                                        <option value = "CA">Canada</option>
                                        <option value = "FR">France</option>
                                        <option value = "DE">Germany</option>
                                        <option value = "GB">Great Britain</option>
                                        <option value = "GR">Greece</option>
                                        <option value = "IN">India</option>
                                        <option value = "IT">Italy</option>
                                        <option value = "JP">Japan</option>
                                        <option value = "MX">Mexico</option>
                                        <option value = "NL">Netherlands</option>
                                        <option value = "NZ">New Zealand</option>
                                        <option value = "NO">Norway</option>
                                        <option value = "PT">Portugal</option>
                                        <option value = "ES">Spain</option>
                                        <option value = "ZA">South Africa</option>
                                        <option value = "SE">Sweden</option>
                                        <option value = "TR">Turkey</option>
                                    </select>
                                </form>
                            </div>
                            <div className = "Option-Container">
                            <form>
                                <div className = "Recommendation-Title Align-Center"> Limit </div>
                                <select value={this.state.limit} onChange={this.handleLimit} className = "select-css select-margin">
                                    <option value = "1">1</option>
                                    <option value = "3">3</option>
                                    <option value = "5">5</option>
                                    <option value = "10">10</option>
                                    <option value = "20">20</option>
                                    <option value = "50">50</option>
                                    <option value = "100">100</option>
                                </select>
                            </form>
                            </div>
                        </div>
                        <button onClick = {() => this.getRecommendations(recommendation_options)}> Recommendations </button>
                        <div className = "Artist-Features-Container">
                        {this.state.recommendations && this.state.recommendations.map(
                            recommendation => (
                                <div className = "Artist-Container Blue Box-Shadow-1" onClick = {() => window.open(recommendation.uri, "_blank")}>
                                    <div className = "Artist-Row">
                                        {<img src = {recommendation.album.images[2].url} alt = "Artist Pic" className = "Artist-Image"/>}
                                        <div className = "Artist-Column Column">
                                            <div className = "Artist-Info"> {recommendation.name} </div>
                                            <div className = "Artist-Info Popularity-Info"> Popularity: {recommendation.popularity} </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                        </div>
                        <br></br>
                        {!this.state.recommendations && <div><br></br><br></br><br></br></div>}
                    </div>
                }
            </div>
        )
    }
}

export default Features;