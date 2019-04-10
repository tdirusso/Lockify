import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const root = document.getElementById('root');

ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route component={Login} />
            </Switch>
        </div>
    </Router>
, root);