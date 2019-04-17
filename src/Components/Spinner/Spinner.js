import React, { Component } from 'react';
import './Spinner.css';

class Spinner extends Component {

    render() {
        return (
            this.props.isLoading ? (<div className="spinner"></div>) : (null)
        );
    }
}

export default Spinner;