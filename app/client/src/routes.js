/**
 * Created by Masa on 24-Jan-17.
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Main from './components/Gameplay/Main';
import Login from './components/Login/Login';
import App from './components/App/App';
import Lobby from './components/Lobby/Lobby';
import Home from './components/Home/Home';
import Auth from './Auth';
import EnsureAuthContainer from './components/EnsureAuthContainer/EnsureAuthContainer';
import PageNotFound from './components/PageNotFound';

export default (
    <Route path='/' component={App}>
        <IndexRoute component={Login} onEnter={(nextState, replace) => {
            if (Auth.isUserAuthenticated()) {
                replace('home');
            }
        }} />
        <Route component={EnsureAuthContainer}>
            <Route path="home" component={Home} />
            <Route path="game" component={Main} />
            <Route path="lobby" component={Lobby} />
        </Route>
        <Route path="*" component={PageNotFound} />
    </Route>
)
