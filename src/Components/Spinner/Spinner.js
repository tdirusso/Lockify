import React, { Component } from 'react';
import './Spinner.css';
import ReactLoading from 'react-loading';

class Spinner extends Component {

    render() {
        return (
            <div className="spinner-container">
                <ReactLoading type="spinningBubbles" color="white" width={250} height={250} className="spinner"/>
            </div>
        );
    }
}

export default Spinner;