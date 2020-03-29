import React, { Component } from 'react';
import './Login.css';

const protocol = 'https';
const domain = 'accounts.spotify.com/authorize';
const response_type = 'token';
const client_id = process.env.REACT_APP_CLIENT_ID;
const scope = encodeURIComponent('user-library-read user-read-email');
const redirect_uri = 'http://localhost:3000/dashboard';

const authorizeURL = `${protocol}://${domain}?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=123`;

class Login extends Component {

	render() {
		const login = () => window.location.href = authorizeURL;

		return (
			<div className="container">
				<div className="animated fadeInDown welcome-container">
					<div className="title-container">
						<div className="title">Lockify</div>
						<div className="description">Backup your Spotify playist for free access to recently deleted songs.</div>
					</div>
					<button onClick={login} className="login-button">Login With Spotify</button>
				</div>
			</div>
		);
	}
}

export default Login;