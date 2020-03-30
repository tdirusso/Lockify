import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Footer from './Components/Footer/Footer';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const root = document.getElementById('root');

const currentURL = window.location.href;
const token = currentURL.match(/#(?:access_token)=([\S\s]*?)&/);

ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route exact path="/dashboard" component={() => token ? <Dashboard /> : <Redirect to="/" />} />
                <Route component={Login} />
            </Switch>
            <Footer />
        </div>
    </Router>
    , root);