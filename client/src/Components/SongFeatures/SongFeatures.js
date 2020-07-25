import React, {Component} from 'react';
import './SongFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
import RadarChart from 'react-svg-radar-chart';
// import 'react-svg-radar-chart/build/css/index.css'
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
            },
            display: false,
            selected: true
        }
    }

    getAudioAnalysis() {
        spotifyApi.getAudioFeaturesForTrack(this.props.playback.track_id)
            .then((response) => {
                console.log(response, 'audio analysis')
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
        }
    }

    select() {
        this.state.selected ? this.setState({selected: false}) : this.setState({selected: true})
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
            meta: {color: 'gray'}
        }

        const datas = [dataset]

        const options = {
            size: 800,
            captionMargin: 20
        }

        return(
            <div>
                <div className = "Line">
                    {/* <div className = "Title"> Audio Analysis </div> */}
                    {this.state.selected ? <button className = "Dropdown" onClick = {() => this.select()}> ^ </button>
                    : <button className = "Dropdown" onClick = {() => this.select()}> v </button>}
                    <div className = "Title"> Audio Analysis </div>
                </div>
                {this.state.selected && 
                <div>
                    {this.state.display &&
                    <div className = "Container">
                        <div className = "Chart"> 
                            <RadarChart data = {datas} captions = {caps} size = {400}/>
                        </div>
                        <div className = "List"> 
                            <div className = "Feature"> Danceability: {this.state.data.danceability} </div>
                            <div className = "Feature"> Energy: {this.state.data.energy.toFixed(3)} </div>
                            <div className = "Feature"> Valence: {this.state.data.valence.toFixed(3)} </div>
                            <div className = "Feature"> Acousticness: {this.state.data.acousticness.toFixed(3)} </div>
                            <div className = "Feature"> Instrumentalness: {this.state.data.instrumentalness.toFixed(3)} </div>
                            <div className = "Feature"> Liveness: {this.state.data.liveness.toFixed(3)} </div>
                            <div className = "Feature"> Speechiness: {this.state.data.speechiness.toFixed(3)} </div>
                        </div>
                    </div>
                    }
                </div>
                }
            </div>
        )
    }
}

export default SongFeatures;