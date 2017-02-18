import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';
import Rules from '../Lobby/Rules';
import UserStore from '../../stores/UserStore';
import GameInitStore from '../../stores/GameInitStore';
import GameInitActions from '../../actions/GameInitActions';
import _ from 'lodash';
import io from 'socket.io-client';
import Auth from '../../Auth';

var socket;

class GameInitializer extends React.Component {
    constructor() {
        super();

        this.state = {
            game: GameInitStore.getState(),
            showReady: true
        };

        this.onChange = this.onChange.bind(this);

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    onChange() {
        this.setState({ game: GameInitStore.getState() });
    }

    handleFriendInvite(username) {
        socket.emit('user:invite', username);
    }

    handleGameStart() {
       socket.emit('game:start');
    };

    handleReady() {
        socket.emit('user:ready', UserStore.getState().username);
        this.setState({ showReady: false });
    };

    componentDidMount() {
        GameInitStore.listen(this.onChange);

        socket = io('/lobby');
        socket.on('connect', () => {
            socket.emit('authenticate', { token: Auth.getToken() });
            socket.on('authenticated', () => {
                socket.emit('join', this.props.creatorUsername);
                socket.on('init', (lobbyUsers) => {
                    GameInitActions.initLobby(lobbyUsers);
                });
                socket.on('user:ready', (readyUsername) => {
                    GameInitActions.userReady(readyUsername);
                });
                socket.on('user:join', (username) => {
                    GameInitActions.userJoined(username);
                });
                socket.on('user:left', (username) => {
                    GameInitActions.userLeft(username);
                });
                socket.on('game:started', () => {
                    this.props.onGameStart();
                });
            });
        });
    }

    componentWillUnmount() {
        GameInitStore.unlisten(this.onChange);
        socket.disconnect();
    }

    get styles() {
        return {
            container: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
            },
            playersContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            section: {
                padding: '0 16px 20px',
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            },
            title: {
                padding: '4px 16px 0px',
                fontSize: '22px',
                lineHeight: '32px',
                fontWeight: 400,
            }
        }
    }

    render() {
        const myUsername = UserStore.getState().username;
        const myGame = myUsername === this.props.creatorUsername;
        const allReady = this.state.allUsersReady;
        const inviteFriends = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Invite friends</h3>
            <FriendPicker onPick={this.handleFriendInvite}/>
        </div>;

        const rules = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Rules</h3>
            <Rules rules={this.state.game.rules}/>
        </div>
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.playersContainer}>
                    {
                        myUsername === this.props.creatorUsername ? inviteFriends : rules
                    }
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Lobby</h3>
                        <Lobby users={this.state.game.lobby} gameCreatorUsername={this.props.creatorUsername}/>
                        {!myGame && this.state.showReady && <RaisedButton primary={true} label="ready" onClick={this.handleReady}/> }
                    </div>
                </div>
                {myGame && <RaisedButton onClick={this.handleGameStart} label="Start game" primary={allReady} disabled={!allReady}/> }
            </div>
        );
    }
}
export default GameInitializer;

GameInitializer.defaultProps = {};

GameInitializer.propTypes = {
    onGameStart: React.PropTypes.func
};