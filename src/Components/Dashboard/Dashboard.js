import React, { Component } from 'react';
import './Dashboard.css';
const qs = require('querystring');

class Dashboard extends Component {

    getTracks(code) {
        fetch(`/token?code=${code}`)
            .then(data => data.ok ? data.json() : Error(data.statusText))
            .then((response) => {
                if (response.error) {
                    throw new Error(response.error);
                } else {
                    const token = JSON.parse(response).access_token;
                    return fetch(`/tracks?token=${token}`);
                }
            })
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
                    {this.getTracks(code)}
                    Dashboard
                </div>
            );
        }
    }
}

export default Dashboard;