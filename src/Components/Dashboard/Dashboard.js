import SavedUser from '../SavedUser/SavedUser';
import React, { Component } from 'react';
import Spinner from '../Spinner/Spinner';
import NewUser from '../NewUser/NewUser';
import Header from '../Header/Header';
import Card from '../Card/Card';
import './Dashboard.css';
import { authorize_url } from '../Login/Login';

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
        const self = this;

        const options = {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        };

        fetch(`https://api.spotify.com/v1/me`, options)
            .then(data => {
                if (data.status === 401) {
                    window.location.href = authorize_url;
                }

                return data.ok ? data.json() : Error(data.statusText)
            })
            .then(response => {
                const existingUser = localStorage.getItem(`lockify-${response.id}`);

                if (!existingUser) {
                    self.setState({
                        user: response.id,
                        new_user: true,
                        loading: false
                    });
                } else {
                    self.setState({
                        user: response.id,
                        new_user: false,
                    });
                    self.getDeletedSongs();
                }
            }).catch(error => console.log(error));
    }

    storeSongs() {
        this.setState({ loading: true });
        const self = this;
        let songs = [];

        getSongs('https://api.spotify.com/v1/me/tracks?limit=50').then(() => {
            const song_string = JSON.stringify(songs);
            localStorage.setItem(`lockify-${self.state.user}`, song_string);

            self.setState({
                loading: false,
                new_user: false,
                new_user_saved: true
            });
        }).catch(error => console.log(error));

        function getSongs(URL) {
            const options = {
                headers: {
                    'Authorization': `Bearer ${self.getToken()}`
                }
            };

            return new Promise((resolve, reject) => {
                fetch(URL, options)
                    .then(data => {
                        if (data.status === 401) {
                            window.location.href = authorize_url;
                        }

                        return data.ok ? data.json() : Error(data.statusText);
                    })
                    .then((response) => {
                        response.items.forEach(song => {
                            songs.push({ Name: song.track.name, Artist: song.track.artists[0], Image: song.track.album.images[0], URL: song.track.external_urls.spotify });
                        });

                        resolve(response.next ? getSongs(response.next) : '');
                    })
                    .catch(error => reject(error));
            });
        }
    }

    updateSongs() {
        const confirmed = window.confirm('This will override your backed-up songs with your current Spotify playlist.\n\nContinue?');
        if (confirmed) {
            this.storeSongs();
        }
    }

    getDeletedSongs() {
        const self = this;

        let storedSongs = localStorage.getItem(`lockify-${self.state.user}`);

        if (storedSongs) {
            storedSongs = JSON.parse(storedSongs);

            let songs = [];
            getSongs('https://api.spotify.com/v1/me/tracks?limit=50').then(() => {
                let deletedSongs = storedSongs.filter(song => !songs.includes(song.Name));
                self.setState({
                    loading: false,
                    deleted_songs: deletedSongs
                });
            }).catch(error => console.log(error));

            function getSongs(URL) {
                const options = {
                    headers: {
                        'Authorization': `Bearer ${self.getToken()}`
                    }
                };

                return new Promise((resolve, reject) => {
                    fetch(URL, options)
                        .then(data => {
                            if (data.status === 401) {
                                window.location.href = authorize_url;
                            }

                            return data.ok ? data.json() : Error(data.statusText);
                        })
                        .then((response) => {
                            response.items.forEach(song => {
                                songs.push(song.track.name);
                            });

                            resolve(response.next ? getSongs(response.next) : '');
                        })
                        .catch(error => reject(error));
                });
            }
        }
    }

    sync() {
        this.setState({ loading: true });
        this.getDeletedSongs();
    }

    deleteAccount() {
        const confirmed = window.confirm('Are you sure you want to delete your Lockify account?\n\nAll of your data will be deleted.');

        if (confirmed) {
            localStorage.removeItem(`lockify-${this.state.user}`);
            window.location.href = window.location.origin;
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
                return <NewUser username={this.state.user} storeSongs={this.storeSongs} />;
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