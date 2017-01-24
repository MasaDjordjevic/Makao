/**
 * Created by Masa on 24-Jan-17.
 */
import React from 'react';
import {Route} from 'react-router';
import Main from 'Gameplay/Main';
import Login from './Login/Login';
import App from './App';
import Lobby from './Lobby/Lobby';

export default (
    <Route component={App}>
        <Route path="/" component={Login} />
        <Route path="/game" component={Main} />
        <Route path="/lobby" component={Lobby} />
    </Route>
)