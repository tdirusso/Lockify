import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

    render() {
        return (
            <div className="card" onClick={() => window.open(this.props.song.URL, '_blank')}>
                <div className="card-image">
                    <img src={this.props.song.Image.url} alt="Album" />
                </div>
                <div className="card-song-title">
                    {this.props.song.Name}
                </div>
                <div className="card-song-artist">
                    {this.props.song.Artist.name}
                </div>
            </div>
        );
    }

}

export default Card;