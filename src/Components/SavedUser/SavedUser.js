import React, { Component } from 'react';
import './SavedUser.css';

class SavedUser extends Component {

    render() {
        return (
            <div className="container">
                <div className="title animated fadeInDown saved-user">Thank You</div>
                <div className="description animated fadeInDown margin saved-user">Click the button below to access the dashboard.</div>
                <button onClick={() => window.location.reload()} className="dashboard-button main-button animated fadeInDown">Dashboard</button>
            </div>
        );
    }

}

export default SavedUser;