import React, {Component} from 'react';
import './Features.css';
import AlbumFeatures from '../AlbumFeatures/AlbumFeatures.js';
import ArtistFeatures from '../ArtistFeatures/ArtistFeatures.js';
import SongFeatures from '../SongFeatures/SongFeatures.js';

class Features extends Component {
    constructor(props){
        super(props);
        this.state = {
            response: this.props.playback
        }
    }

    render() {
        return (
            <div className = "Features-Container"> 
                <SongFeatures playback = {this.props.playback} new_song = {this.props.new_song}/>
                <AlbumFeatures playback = {this.props.playback} new_song = {this.props.new_song}/> 
                <ArtistFeatures playback = {this.props.playback} new_song = {this.props.new_song}/> 
            </div>
        )
    }
}

export default Features;