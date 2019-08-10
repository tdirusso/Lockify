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
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/);
        const self = this;

        if (token) {
            fetch(`getUser?access_token=${token[1]}`)
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
        }, 500);
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

    isMobile() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    render() {
        const URL = window.location.href;
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/);

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
                                <div className={this.isMobile() ? 'dashboard-title animate fadeIn' : 'dashboard-title animate slideInLeft'}>Deleted since &mdash; <div className="primary">{this.parseDate(this.state.user.updated)}</div></div>
                                {
                                    this.state.deleted_songs.length === 0 ? <div className={this.isMobile() ? 'no-songs-removed animated fadeIn' : 'no-songs-removed animated slideInRight'}>No songs have been removed since your last backup.</div> : this.state.deleted_songs.map((song, index) => {
                                        return (
                                            <div key={index} className={this.isMobile() ? 'card-container animate fadeIn' : 'card-container animate bounceInUp'}>
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