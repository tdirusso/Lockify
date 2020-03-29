import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {

    render() {
        return (
            <footer>
                <ul className="media-list">
                    <li><a href="https://www.linkedin.com/in/tim-dirusso/" target="_blank">LinkedIn</a></li>
                    <li><a href="https://github.com/tdirusso" target="_blank">GitHub</a></li>
                    <li><a href="https://twitter.com/timdirusso" target="_blank">Twitter</a></li>
                    <li><a href="mailto:timgdirusso@gmai.com?Subject=Lockify Inquiry" target="_top">Contact Us</a></li>
                </ul>
            </footer>
        );
    }
    
}

export default Footer;