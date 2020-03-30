import React, { Component } from 'react';
import './NewUser.css';

class NewUser extends Component {

    render() {
        return (
            <div className="container">
                <div className="new-user-hello animated fadeInDown">Hello {this.props.username}!</div>
                <div className="no-back-up animated fadeInDown">Your songs are not yet backed up.</div>
                <div className="get-started animated fadeInDown">Click the button below to get started!</div>
                <button onClick={() => this.props.storeSongs()} className="backup-button animated fadeInDown main-button">Store My Music</button>
            </div>
        );
    }
    
}

export default NewUser;