import SavedUser from '../SavedUser/SavedUser';
import React, { Component } from 'react';
import Spinner from '../Spinner/Spinner';
import NewUser from '../NewUser/NewUser';
import Header from '../Header/Header';
import Card from '../Card/Card';
import './Dashboard.css';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            deleted_songs: []
        };
    }

    componentDidMount() {
        this.getUser();
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateSongs = this.updateSongs.bind(this);
        this.storeSongs = this.storeSongs.bind(this);
        this.sync = this.sync.bind(this);
    }

    getToken() {
        const currentURL = window.location.href;
        const token = currentURL.match(/#(?:access_token)=([\S\s]*?)&/);
        return token[1];
    }

    getUser() {
        const token = this.getToken();
        const self = this;

        fetch(`api/getUser?access_token=${token}`)
            .then(data => data.ok ? data.json() : Error(data.statusText))
            .then(response => {
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
            }).catch(error => console.log(error));
    }


    storeSongs() {
        this.setState({ loading: true });
        const self = this;

        fetch('api/storeSongs', {
            method: 'POST',
            body: JSON.stringify({
                user: self.state.user,
                token: this.getToken()
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            self.setState({
                loading: false,
                new_user: false,
                new_user_saved: true
            });
        }).catch(error => console.log(error));

    }

    updateSongs() {
        const confirmed = window.confirm('This will override your backed-up songs with your current Spotify playlist.\n\nContinue?');
        if (confirmed) {
            this.storeSongs();
        }
    }

    getDeletedSongs() {
        const token = this.getToken();
        const self = this;

        fetch('api/deletedSongs', {
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
                let deleted_songs = JSON.parse(response);
                deleted_songs[0].Artist.name = 'df fd df f d fdf d d f sdf ds fdfd d fd f d ';
                deleted_songs[0].Name = 'sdf df ds df df df df df d sdf sd sd dd f';
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);
                deleted_songs.push(deleted_songs[0]);

                self.setState({
                    loading: false,
                    deleted_songs: deleted_songs
                });
            }).catch(error => console.log(error));
    }

    sync() {
        this.setState({ loading: true });
        this.getDeletedSongs();
    }

    deleteAccount() {
        const self = this;
        const confirmed = window.confirm('Are you sure you want to delete your Lockify account?\n\nAll of your data will be deleted.');

        if (confirmed) {
            fetch('api/deleteAccount', {
                method: 'POST',
                body: JSON.stringify({ user: self.state.user }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                window.location = window.location.origin;
            }).catch(error => console.log(error));
        }
    }

    renderCards() {
        if (this.state.deleted_songs.length === 0) {
            return <div className="description">No songs have been deleted since your last backup <span role="img" aria-label=":)">&#128578;</span></div>;
        }

        return this.state.deleted_songs.map((song, index) => <Card key={index} song={song} />);
    }

    render() {
        if (this.state.loading) {
            return <Spinner />;
        } else {
            if (this.state.new_user) {
                return <NewUser username={this.state.user.display_name} storeSongs={this.storeSongs} />;
            } else if (this.state.new_user_saved) {
                return <SavedUser />;
            } else {
                return (
                    <div>
                        <Header updateSongs={this.updateSongs} sync={this.sync} deleteAccount={this.deleteAccount} />
                        <div className="deleted-container">
                            <div className="title animated fadeInDown">Songs you've deleted since {new Date(this.state.user.updated).toLocaleDateString()}</div>
                            <br />
                            <div className="animated fadeInUp cards-container">
                                {this.renderCards()}
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Dashboard;