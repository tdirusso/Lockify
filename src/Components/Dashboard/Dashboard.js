import React, { Component } from 'react';
import './Dashboard.css';
const qs = require('querystring');

class Dashboard extends Component {

    getToken(code) {
        const self = this;
        fetch(`token?code=${code}`)
            .then(data => data.ok ? data.json() : Error(data.statusText))
            .then(response => self.saveUser(response))
            .then(data => data.json())
            .then(response => console.log(response))
            .catch(error => console.log(error));
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
            .then((response) => {
                console.log(JSON.parse(response));
            })
            .catch(error => console.log(error));
    }

    render() {
        const query = qs.parse(window.location.search);
        const code = query['?code'];
        if (!code) {
            this.props.history.push('/');
            return null;
        } else {
            return (
                <div className="container">
                    {this.getToken(code)}
                    Dashboard
                </div>
            );
        }
    }
}

export default Dashboard;