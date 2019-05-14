import React, { Component } from 'react';
import './Dashboard.css';
import Spinner from '../Spinner/Spinner';
import Sync from '../../Assets/sync.svg';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
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
                            setTimeout(() => {
                                self.setState({
                                    user: response,
                                    new_user: false,
                                    loading: false
                                });
                            }, 1500);
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
        })
            .then((response) => {
                console.log(response)
                setTimeout(() => {
                    self.setState({
                        loading: false,
                        new_user: undefined,
                        new_user_saved: true
                    });
                    console.log(self.state);
                }, 1000);
            })
            .catch(error => console.log(error));
    }

    parseDate(date) {
        return new Date(date).toDateString();
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
                                <button onClick={() => window.location.reload()} className="backup-button header-left">Backup</button>
                                <img src={Sync} className="sync" />
                                <button onClick={() => window.location.reload()} className="delete-button header-right">Delete</button>
                            </div>

                            <div class="deleted-container">
                                <div className="dashboard-title">Deleted since &mdash; <div className="primary">{this.parseDate(this.state.user.updated)}</div></div>
                                <div className="card-container first">
                                    <div className="card">
                                        <div className="card-image">
                                            <img src="https://img.discogs.com/rm50OyzB4jLcbftN-IEM99VFF8w=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1445651-1308162454.jpeg.jpg" />
                                        </div>
                                        <div className="card-song-title">
                                            Far Away
                                            </div>
                                        <div className="card-song-artist">
                                            Nickelback
                                            </div>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <div className="card">
                                        <div className="card-image">
                                            <img src="https://img.discogs.com/rm50OyzB4jLcbftN-IEM99VFF8w=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1445651-1308162454.jpeg.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <div className="card">
                                        <div className="card-image">
                                            <img src="https://img.discogs.com/rm50OyzB4jLcbftN-IEM99VFF8w=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1445651-1308162454.jpeg.jpg" />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-container">
                                    <div className="card">
                                        <div className="card-image">
                                            <img src="https://img.discogs.com/rm50OyzB4jLcbftN-IEM99VFF8w=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1445651-1308162454.jpeg.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        }
    }
}

export default Dashboard;