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
                    console.log(response);
                    if (response.redirect === true) {
                        window.location = response.URL;
                    } else {
                        setTimeout(() => {
                            if (response.length === 0) {
                                self.setState({
                                    new_user: true,
                                    loading: false
                                })
                            } else {
                                self.setState({
                                    new_user: false,
                                    loading: false
                                })
                            }
                        }, 3500)
                    }
                })
                .catch(error => console.log(error));
        }
    }

    saveUser(token_json) {
        token_json = JSON.parse(token_json);
        if (token_json.error) {
            throw new Error(token_json.error);
        } else {
            const access_token = token_json.access_token;
            const refresh_token = token_json.refresh_token;

            return fetch('saveUser', {
                method: 'POST',
                body: JSON.stringify({ access_token, refresh_token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    getTracks(access_token) {
        fetch(`tracks?token=${access_token}`)
            .then(data => data.ok ? data.json() : Error(data.statusText))
            .then(response => {
                console.log(JSON.parse(response));
            })
            .catch(error => console.log(error));
    }

    render() {
        const URL = window.location.href;
        const token = URL.match(/#(?:access_token)=([\S\s]*?)&/)[1];

        if (!token) {
            this.props.history.push('/');
            return null;
        } else {
            return (
                <div className="container">
                    <Spinner isLoading={this.state.loading}/>
                    {this.state.loading ? (<div className="please-wait">Please wait...</div>) : (<div>Existing</div>)}
                </div>
            );
        }
    }
}

export default Dashboard;