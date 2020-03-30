import React, { Component } from 'react';
import Sync from '../../Assets/sync.svg';
import './Header.css';

class Header extends Component {

    render() {
        return (
            <div className="header">
                <button onClick={() => this.props.updateSongs()} className="dash-backup-button">Backup</button>
                <img onClick={() => this.props.sync()} src={Sync} className="sync" alt="Sync" />
                <button onClick={() => this.props.deleteAccount()} className="delete-button">Delete</button>
            </div>
        );
    }

}

export default Header;