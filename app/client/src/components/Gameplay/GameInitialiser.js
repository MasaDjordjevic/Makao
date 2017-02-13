import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';
import RulesSetter from '../Lobby/Rules';
import GlobalVariables from '../Gameplay/GlobalVariables';
import _ from 'lodash';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/lobby');

class GameInitialiser extends React.Component {
    constructor() {
        super();

        this.state = {
            me: -1,
            creatorId: 1,
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
        };

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
    }

    handleFriendInvite(userId) {
        console.log("invite friend: " + userId);
    }

    handleUserJoin = (username) => {
        let users = this.state.users.slice();
        users.push({username: username, ready: false});
        this.setState({users: users});
    };

    handleUserReady = (username) => {
        let users = this.state.users.slice();
        _.find(users, {username: username}).ready = true;
        this.setState({users: users});
    };

    handleReady = () => {
        const username = this.state.me.username;
        this.handleUserReady(username);
        socket.emit('user:ready', username);
    };

    handleSocketInit = (users) => {
        let newUsers = [];
        Object.keys(users).forEach((key, index)=> {
            newUsers.push({username: key, ready: users[key].ready});
        });

        this.setState({users: newUsers, me: newUsers[newUsers.length-1]});
    };

    componentDidMount(){
        socket.emit('join', 'user ' + Math.round(Math.random()*10));
        socket.on('init', this.handleSocketInit);
        socket.on('user:ready',  this.handleUserReady);
        socket.on('user:join', this.handleUserJoin);
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
        const inviteFriends = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Invite friends</h3>
            <FriendPicker onPick={this.handleFriendInvite}/>
        </div>;

        const rules =  <div style={this.styles.section}>
            <h3 style={this.styles.title}>Rules</h3>
            <RulesSetter rules={this.state.rules} />
        </div>
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.playersContainer}>
                    {
                        this.state.creatorId === GlobalVariables.userId ? inviteFriends : rules
                    }
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Lobby</h3>
                        <Lobby users={this.state.users} />
                        <RaisedButton primary={true} label="ready" onClick={this.handleReady} />
                    </div>
                </div>
                <RaisedButton onClick={this.props.onGameStart} label="Start game"/>
            </div>
        );
    }
}
export default GameInitialiser;

GameInitialiser.defaultProps = {};

GameInitialiser.propTypes = {
    onGameStart: React.PropTypes.func
};