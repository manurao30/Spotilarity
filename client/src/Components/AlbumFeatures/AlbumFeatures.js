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
            selected: true
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
            <div className = "BG-2">
                <div className = "Album-Line">
                    {this.state.selected ? <button className = "Dropdown-Album" onClick = {() => this.select()}> ^ </button>
                    : <button className = "Dropdown-Album" onClick = {() => this.select()}> v </button>}
                    <div className = "Title"> Album Features </div>
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
        )
    }
}

export default AlbumFeatures;