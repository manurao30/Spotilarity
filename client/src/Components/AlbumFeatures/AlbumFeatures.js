import React, {Component} from 'react';
import './AlbumFeatures.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class AlbumFeatures extends Component{
    constructor(props){
        super(props);
        this.state = {
            tracks: [],
            display: false,
            selected: false
        }
    }

    componentDidMount() {
        setTimeout(function() { //Start the timer
            this.getTracksInAlbum()
            this.setState({
                display: true
            });
        }.bind(this), 1250);
        this.interval = setInterval(() => this.tick(), 100000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        if(this.props.new_song) {
            this.getTracksInAlbum();
        }
    }

    select() {
        this.state.selected ? this.setState({selected: false}) : this.setState({selected: true})
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
                <div className = "Line">
                    <div className = "Title"> Album Features </div>
                    {this.state.selected ? <button className = "Dropdown" onClick = {() => this.select()}> ^ </button>
                    : <button className = "Dropdown" onClick = {() => this.select()}> v </button>}
                </div>
                {this.state.selected && 
                <div className = "Album-Features-Container">
                    {this.state.tracks.map(
                        track => (
                            <div key = {track.track_number} className = "Album-Container">
                                {track.name}
                            </div>
                        )
                    )}
                </div>
            }
            </div>
        )
    }
}

export default AlbumFeatures;