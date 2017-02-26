import React from 'react';
import { browserHistory } from 'react-router';
import UserStore from '../../stores/UserStore';
import io from 'socket.io-client';
import Auth from '../../Auth';
import PlayGame from './PlayGame';

var socket;

class PlaySocketWrapper extends React.Component {
    constructor() {
        super();

        this.state = {
            gameList: []
        };

        this.updateGameList = this.updateGameList.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    updateGameList(newGames) {
        this.setState({ gameList: newGames });
    }

    handleCreate = (rules) => {
        socket.emit('game:create', rules);
    };

    handleOpen = () => {
        socket.emit('game:list');
    };

    componentDidMount() {
        let thisComp = this;
        socket = io('/play');
        socket.emit('authenticate', { token: Auth.getToken() });
        socket.on('authenticated', () => {
            socket.emit('game:list');
            socket.on('game:list', (newGames) => {
                thisComp.updateGameList(newGames);
            });
            socket.on('game:created', (game) => {
                browserHistory.push('/');
                browserHistory.push( '/game/' + UserStore.getState().username);
            });
            socket.on('game:failed', (reason) => {
                alert('Game creation failed: ' + reason);
            });
        });
        socket.on('unauthorized', () => alert('You are unauthorized.'));
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    render() {
        return (
            <PlayGame style={this.props.style}
                      onCreate={this.handleCreate}
                      gameList={this.state.gameList}
                      onOpen={this.handleOpen}
            />
        );
    }
}

export default PlaySocketWrapper;

PlaySocketWrapper.defaultProps = {};
PlaySocketWrapper.propTypes = {};