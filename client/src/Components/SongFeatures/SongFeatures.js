import React, {Component} from 'react';
import './SongFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
const spotifyApi = new SpotifyWebApi();

class SongFeatures extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {
                danceability: 0,
                energy: 0,
                valence: 0,
                acousticness: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0
            }
        }
    }

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.props.playback.track_id)
            .then((response) => {
                console.log(response)
                this.setState({
                    data: 
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

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.getAudioAnalysis()
        }.bind(this), 1000)
        this.interval = setInterval(() => this.tick(), 100000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.getAudioAnalysis();
    }

    render() {
        const caps = {
            // columns
            danceability: 'Danceability',
            energy: 'Energy',
            valence: 'Valence',
            acousticness: 'Acousticness',
            instrumentalness: 'Instrumentalness',
            liveness: 'Liveness',
            speechiness: 'Speechiness'
          };

        const dataset = {
            data: {
                danceability: this.state.data.danceability,
                energy: this.state.data.energy,
                valence: this.state.data.valence,
                acousticness: this.state.data.acousticness,
                instrumentalness: this.state.data.instrumentalness,
                liveness: this.state.data.liveness,
                speechiness: this.state.data.speechiness
            },
            meta: {color: 'blue'}
        }

        const datas = [dataset]

        return(
            <div>
                <div className = "Title"> Audio Analysis </div>
                <RadarChart data = {datas} captions = {caps}/>
            </div>
        )
    }
}

export default SongFeatures;