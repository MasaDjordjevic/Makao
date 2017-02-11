/**
 * Created by Masa on 24-Jan-17.
 */
import React from 'react';
import {Route} from 'react-router';
import Main from './components/Gameplay/Main';
import Login from './components/Login/Login';
import App from './components/App/App';
import Lobby from './components/Lobby/Lobby';
import Home from './components/Home/Home';

export default (
    <Route component={App}>
        <Route path="/" component={Login} />
        <Route path="/game" component={Main} />
        <Route path="/lobby" component={Lobby} />
        <Route path="/home" component={Home} />
    </Route>
)
