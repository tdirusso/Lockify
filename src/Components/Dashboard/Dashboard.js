import React, { Component } from 'react';
import './Dashboard.css';
import Spinner from '../Spinner/Spinner';
import Sync from '../../Assets/sync.svg';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            deleted_songs: []
        };
    }

    componentDidMount() {
        const URL = window.location.href;
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/)[1];
        const self = this;

        if (token) {
            fetch(`getUser?access_token=${token}`)
                .then(data => data.ok ? data.json() : Error(data.statusText))
                .then(response => {
                    console.log(response);
                    if (response.redirect === true) {
                        window.location = response.URL;
                    } else {
                        if (response.updated === undefined) {
                            self.setState({
                                user: response,
                                new_user: true,
                                loading: false
                            });
                        } else {
                            self.setState({
                                user: response,
                                new_user: false,
                            });
                            self.getDeletedSongs();
                        }
                    }
                })
                .catch(error => console.log(error));
        }
    }


    storeSongs() {
        this.setState({ loading: true });
        const self = this;

        fetch('storeSongs', {
            method: 'POST',
            body: JSON.stringify({ user: self.state.user }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            setTimeout(() => {
                self.setState({
                    loading: false,
                    new_user: undefined,
                    new_user_saved: true
                });
            }, 1000);
        }).catch(error => console.log(error));

    }

    updateSongs() {
        const confirmed = window.confirm('You are about to override your backed up songs with your current Spotify songs list.  Would you like to continue?');
        if (confirmed) {
            this.storeSongs();
        }
    }

    parseDate(date) {
        return new Date(date).toDateString();
    }

    getDeletedSongs() {
        const URL = window.location.href;
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/)[1];
        const self = this;

        fetch('deletedSongs', {
            method: 'POST',
            body: JSON.stringify({
                user: self.state.user,
                access_token: token
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => data.ok ? data.json() : Error(data.statusText))
            .then((response) => {
                const deleted_songs = JSON.parse(response);
                self.setState({
                    loading: false,
                    deleted_songs: deleted_songs
                });
            }).catch(error => console.log(error));
    }

    sync() {
        document.querySelector('.sync').className += ' spin ';
        setTimeout(() => {
            this.setState({ loading: true });
            this.getDeletedSongs();
        }, 1250);
    }

    deleteAccount() {
        const self = this;
        const confirmed = window.confirm('Are you sure you want to delete your Lockify account?  All of your data will be permanently lost.');

        if (confirmed) {
            fetch('deleteAccount', {
                method: 'POST',
                body: JSON.stringify({ user: self.state.user }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                window.location = window.location.origin + '/';
            }).catch(error => console.log(error));
        }
    }

    render() {
        const URL = window.location.href;
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/)[1];

        if (!token) {
            this.props.history.push('/');
            return null;
        } else {
            if (this.state.loading) {
                return (
                    <div className="container">
                        <Spinner />
                        <div className="please-wait animated bounceInUp">Please wait...</div>
                    </div>
                );
            } else {
                if (this.state.new_user) {
                    return (
                        <div className="container new-center">
                            <div className="hello animated fadeInDown">Hello {this.state.user.display_name}!</div>
                            <div className="no-back-up animated bounceInLeft">It looks like we don't yet have your songs backed up.</div>
                            <div className="get-started animated bounceInLeft">Click the button below to get started!</div>
                            <button onClick={() => this.storeSongs()} className="backup-button animated bounceInRight">Store My Music</button>
                        </div>
                    );
                } else if (this.state.new_user_saved) {
                    return (
                        <div className="container new-center">
                            <div className="thank-you animated bounceInLeft">
                                Thank you for backing your songs up with Lockify!
                            <br /><br />
                                Click the button below to access the dashboard.
                            </div>
                            <br />
                            <button onClick={() => window.location.reload()} className="backup-button small-delay animated bounceInRight">Dashboard</button>
                        </div>
                    );
                } else {
                    return (
                        <div className="container">
                            <div className="header">
                                <button onClick={() => this.updateSongs()} className="backup-button header-left animate bounceInDown">Backup</button>
                                <img onClick={() => this.sync()} src={Sync} className="sync animate bounceInDown" alt="Sync" />
                                <button onClick={() => this.deleteAccount()} className="delete-button header-right animate bounceInDown">Delete</button>
                            </div>

                            <div className="deleted-container">
                                <div className="dashboard-title animate slideInLeft">Deleted since &mdash; <div className="primary">{this.parseDate(this.state.user.updated)}</div></div>
                                {
                                    this.state.deleted_songs.length === 0 ? <div className="no-songs-removed animated slideInRight">No songs have been removed since your last backup.</div> : this.state.deleted_songs.map((song, index) => {
                                        return (
                                            <div key={index} className="card-container animate bounceInUp">
                                                <div className="card" onClick={() => window.open(song.URL, '_blank')}>
                                                    <div className="card-image">
                                                        <img src={song.Images[0].url} alt="Album" />
                                                    </div>
                                                    <div className="card-song-title">
                                                        {song.Name}
                                                    </div>
                                                    <div className="card-song-artist">
                                                        {song.Artists[0].name}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    );
                }
            }
        }
    }
}

export default Dashboard;