import React, { Component } from 'react';
import './Dashboard.css';
import Spinner from '../Spinner/Spinner';

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
                        console.log(response);
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
                                loading: false
                            });
                        }
                    }
                })
                .catch(error => console.log(error));
        }
    }

    storeSongs() {
        const self = this;
        fetch('storeSongs', {
            method: 'POST',
            body: JSON.stringify({ user: self.state.user }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));
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
                } else {
                    return (
                        <div className="container">
                            <div>Dashboard</div>
                        </div>
                    );
                }
            }
        }
    }
}

export default Dashboard;