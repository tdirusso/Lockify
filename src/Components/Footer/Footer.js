import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {

    render() {
        return (
            <footer>
                <ul className="media-list">
                    <li><a href="https://www.linkedin.com/in/tim-dirusso/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    <li><a href="https://github.com/tdirusso" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://twitter.com/timdirusso" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                    <li><a href="mailto:timgdirusso@gmai.com?Subject=Lockify Inquiry" target="_top">Contact</a></li>
                </ul>
            </footer>
        );
    }
    
}

export default Footer;