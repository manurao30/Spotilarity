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
            <div> 
                <SongFeatures playback = {this.props.playback}/>
                <AlbumFeatures playback = {this.props.playback}/> 
                <ArtistFeatures playback = {this.props.playback}/> 
            </div>
        )
    }
}

export default Features;