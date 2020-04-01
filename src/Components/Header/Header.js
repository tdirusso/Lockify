import React, { Component } from 'react';
import Sync from '../../Assets/sync.png';
import SyncHover from '../../Assets/sync-on.png';
import './Header.css';

class Header extends Component {

    constructor() {
        super();
        this.sync = React.createRef();
        setTimeout(() => {
            this.sync.current.classList.remove('animated');
        }, 500);
    }

    syncOnHover(event) {
        event.target.src = SyncHover;
        event.target.classList.add('hover');
    }

    syncOnOut(event) {
        event.target.src = Sync;
        event.target.classList.remove('hover');
    }

    render() {
        return (
            <div className="header">
                <button onClick={() => this.props.updateSongs()} className="dash-backup-button main-button animated fadeInDown">Update</button>
                <button onClick={() => this.props.deleteAccount()} className="delete-button main-button animated fadeInDown">Delete</button>
                <img onClick={() => this.props.sync()} src={Sync} onMouseOver={this.syncOnHover} onMouseOut={this.syncOnOut} className="sync animated fadeInDown" alt="Sync" ref={this.sync} />
            </div>
        );
    }
}

export default Header;