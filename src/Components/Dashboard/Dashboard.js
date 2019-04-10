import React, { Component } from 'react';
import './Dashboard.css';
const qs = require('querystring');

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }

    login() {
        fetch('https://accounts.spotify.com/api/token')
    }

    render() {
        const query = qs.parse(window.location.search);
        if (!query['?code']) {
            this.props.history.push('/');
            return null;
        } else {
            return (
                <div className="container">
                    {this.login()}
                    Dashboard
                </div>
            );
        }
    }
}

export default Dashboard;