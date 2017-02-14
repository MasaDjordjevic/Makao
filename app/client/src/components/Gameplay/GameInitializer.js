import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';
import RulesSetter from '../Lobby/Rules';
import AuthStore from '../../stores/AuthStore';
import _ from 'lodash';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/lobby');

class GameInitializer extends React.Component {
    constructor() {
        super();

        this.state = {
            me: AuthStore.getState().user,
            creatorUsername: '',
            rules: {
                gameLimit: 150,
                timeLimit: 30,
                playerNumberMin: 2,
                playerNumberMax: 6,
                deckNumber: 1,
                rankFilter: 15,
                private: 1
            },
            users: [],
            allUsersReady: false,
        };

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
    }

    handleFriendInvite(userId) {
        console.log("invite friend: " + userId);
    }

    handleGameStart = () => {
       socket.emit('game:started');
       this.props.onGameStart();
    };

    handleUserLeft = (username) => {
        let users = this.state.users.slice();
        let usr = _.findIndex(users, {username: username});
        if(usr < 0)
            return;
        users.splice(usr, 1);
        this.setState({users: users});
    };

    handleUserJoin = (username) => {
        let users = this.state.users.slice();
        var usr = _.find(users, {username: username});
        if (usr) {
            usr.ready = false;
        } else {
            users.push({username: username, ready: username === this.state.creatorUsername}); //creator of game is always ready
        }
        this.setState({users: users});
    };

    handleUserReady = (username) => {
        let users = this.state.users.slice();
        _.find(users, {username: username}).ready = true;
        const everyUserReady = _.every(users, 'ready');
        this.setState({users: users, allUsersReady: everyUserReady});
    };

    handleReady = () => {
        const username = this.state.me.username;
        this.handleUserReady(username);
        socket.emit('user:ready', username);
    };

    handleSocketInit = (users) => {
        let newUsers = [];
        Object.keys(users).forEach((key, index) => {
            newUsers.push({username: key, ready: key === this.state.creatorUsername || users[key].ready}); //if user is creator set him ready
        });

        this.setState({users: newUsers, me: newUsers[newUsers.length - 1], allUsersReady: _.every(newUsers, 'ready')});
    };

    componentDidMount() {
        this.setState({creatorUsername: this.props.creatorUsername});
        // using props again in emit because state doesn't change immidiately
        socket.emit('join', this.props.creatorUsername,  this.state.me.username);
        socket.on('init', this.handleSocketInit);
        socket.on('user:ready', this.handleUserReady);
        socket.on('user:join', this.handleUserJoin);
        socket.on('user:left', this.handleUserLeft);
        socket.on('game:started', this.props.onGameStart);
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
        const myGame = AuthStore.getState().user.username === this.state.creatorUsername;
        const allReady = this.state.allUsersReady;
        const inviteFriends = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Invite friends</h3>
            <FriendPicker onPick={this.handleFriendInvite}/>
        </div>;

        const rules = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Rules</h3>
            <RulesSetter rules={this.state.rules}/>
        </div>
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.playersContainer}>
                    {
                        this.state.creatorId === this.state.me.id ? inviteFriends : rules
                    }
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Lobby</h3>
                        <Lobby users={this.state.users} gameCreatorUsername={this.state.creatorUsername}/>
                        {!myGame && <RaisedButton primary={true} label="ready" onClick={this.handleReady}/> }
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