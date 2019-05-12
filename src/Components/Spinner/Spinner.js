import React, { Component } from 'react';
import './Spinner.css';
import SpinnerSVG from '../../Assets/loading.svg';

class Spinner extends Component {

    render() {
        return (
            <img src={SpinnerSVG} className="spinner" alt="Lockify"></img>
        );
    }
}

export default Spinner;