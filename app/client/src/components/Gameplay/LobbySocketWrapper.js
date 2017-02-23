import React from 'react';
import UserStore from '../../stores/UserStore';
import GameInitActions from '../../actions/GameInitActions';
import GameInitializer from './GameInitializer';
import io from 'socket.io-client';
import Auth from '../../Auth';

var socket;

class LobbySocketWrapper extends React.Component {
    constructor() {
        super();

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    handleFriendInvite(username) {
        socket.emit('user:invite', username);
    }

    handleGameStart() {
        socket.emit('game:start');
    };

    handleReady() {
        socket.emit('user:ready', UserStore.getState().username);
    };

    componentDidMount() {
        var thisComp = this;
        socket = io('/lobby');
        socket.on('connect', () => {
            socket.emit('authenticate', {token: Auth.getToken()});
            socket.on('authenticated', () => {
                socket.emit('join', thisComp.props.creatorUsername);
                socket.on('init', (data) => {
                    GameInitActions.initLobbyAndRules(data);
                });
                socket.on('user:ready', (readyUsername) => {
                    GameInitActions.userReady(readyUsername);
                });
                socket.on('user:joined', (username) => {
                    GameInitActions.userJoined(username);
                });
                socket.on('user:left', (username) => {
                    GameInitActions.userLeft(username);
                });
                socket.on('game:started', () => {
                    thisComp.props.onGameStart();
                });
            });
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    render() {
        return (
            <GameInitializer style={this.props.style}
                             creatorUsername={this.props.creatorUsername}
                             onInvite={this.handleFriendInvite}
                             onStart={this.handleGameStart}
                             onReady={this.handleReady}
            />
        );
    }
}

export default LobbySocketWrapper;

LobbySocketWrapper.defaultProps = {};
LobbySocketWrapper.propTypes = {
    onGameStart: React.PropTypes.func
};