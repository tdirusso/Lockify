import React, { Component } from 'react';
import './Login.css';
import lock from '../../Assets/lock.svg';

class Login extends Component {

	render() {
		const login = () => {
			window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${process.env.REACT_APP_CLIENT_ID}&scope=user-library-read%20user-read-email&redirect_uri=http://localhost:3000/dashboard&state=123`;
		}

		return (
			<div className="container">
				<img src={lock} className="lock" alt="Lockify"></img>
				<br />
				<div className="title-container">
					<div className="title">Lockify</div>
					<div className="description">The Spotify Backup Service</div>
				</div>
				<button onClick={login} className="login-button">Login With Spotify</button>
			</div>
		);
	}
}

export default Login;