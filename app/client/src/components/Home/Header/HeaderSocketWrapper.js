import React from 'react';
import Auth from '../../../Auth';
import io from 'socket.io-client';
import HomeHeader from './HomeHeader';
import Snackbar from 'material-ui/Snackbar';
import {browserHistory} from 'react-router';
import UserActions from '../../../actions/UserActions';
import UserStore from '../../../stores/UserStore';
var socket;

class HeaderSocketWrapper extends React.Component {

    constructor() {
        super();
        this.state = {
            gameInvites: [],
            // for add friend dialog
            searchResults: null,
            searchMessage: null,
            // for invite reject snackbar message
            rejectResponse: '',
            showResponse: false
        };

        this.handleFriendFound = this.handleFriendFound.bind(this);
        this.handleFriendSearch = this.handleFriendSearch.bind(this);
        this.handleRequestSend = this.handleRequestSend.bind(this);

        this.handleInviteAccept = this.handleInviteAccept.bind(this);
        this.handleInviteIgnore = this.handleInviteIgnore.bind(this);
        this.handleInviteReceive = this.handleInviteReceive.bind(this);
        this.removeInviteFromList = this.removeInviteFromList.bind(this);

        this.handleSnackbarClosing = this.handleSnackbarClosing.bind(this);
    }


    componentDidMount() {
        socket = io();
        socket.on('connect', () => {
            socket.emit('authenticate', {token: Auth.getToken()});
            socket.on('authenticated', () => {
                socket.emit('user:data');
                socket.emit('user:stats');
                socket.emit('leaderboards');
                socket.on('user:data', (data) => {
                    UserActions.updateUserData(data);
                });
                socket.on('user:stats', (stats) => {
                    UserActions.updateUserStats(stats);
                    console.log(JSON.stringify(stats));
                });
                socket.on('leaderboards', (leaderboards) => {
                    UserActions.updateLeaderboards(leaderboards);
                    console.log(leaderboards);
                });
                socket.on('friend:added', (newFriend) => {
                    UserActions.removeFriendRequest(newFriend);
                    UserActions.updateFriendList(newFriend);
                });
                socket.on('friend:ignore', (requestUsername) => {
                    UserActions.removeFriendRequest(requestUsername);
                });
                socket.on('friend:request:sent', () => {
                    // friend request successfuly sent
                });
                socket.on('friend:request:received', (sender) => {
                    UserActions.addFriendRequest(sender);
                });
                socket.on('user:invite', (inviter) => {
                    this.handleInviteReceive(inviter);
                });
                socket.on('invite:accepted', (creatorUsername) => {
                    this.removeInviteFromList(creatorUsername);
                    browserHistory.push('/game/' + creatorUsername);
                });
                socket.on('invite:rejected', (msg) => {
                    this.setState({rejectResponse: msg, showResponse: true});
                });
                socket.on('invite:remove', (creatorUsername) => {
                    this.removeInviteFromList(creatorUsername);
                });
                socket.on('friend:find', this.handleFriendFound)
            });
            socket.on('unauthorized', (msg) => {
                alert(JSON.stringify(msg.data));
            });
        });
    }

    componentWillUnmount() {
        socket.disconnect();
    }

    //////////////////// FRIEND SEARCH ////////////////////
    handleFriendFound(friend) {
        this.setState({searchResults: friend});
    }

    handleFriendSearch(searchText) {
        let user = UserStore.getState();
        if(searchText === user.username){
            this.setState({searchResults: null, searchMessage: "It's your username" });
            return;
        }
        if(user.friends.indexOf(searchText) >= 0){
            this.setState({searchResults: null, searchMessage: "Already a friend" });
            return;
        }

        socket.emit('friend:find', searchText);
    }

    ///////////////////////////////////////////////////////

    /////////////////// FRIEND REQUESTS ///////////////////
    handleRequestSend(selectedUsername) {
        socket.emit('friend:request:send', selectedUsername);
    }

    handleRequestAccept(friendUsername) {
        socket.emit('friend:accept', friendUsername);
    }

    handleRequestIgnore(friendUsername) {
        socket.emit('friend:ignore', friendUsername);
    }

    ///////////////////////////////////////////////////////

    //////////////////// GAME INVITES /////////////////////
    handleInviteReceive(inviter) {
        let currInvites = this.state.gameInvites;
        if (currInvites.indexOf(inviter) === -1) {
            currInvites.push(inviter);
            this.setState({gameInvites: currInvites});
        }
    }

    handleInviteAccept(inviter) {
        socket.emit('invite:accept', inviter);
    }

    handleInviteIgnore(inviter) {
        socket.emit('invite:ignore', inviter);
        this.removeInviteFromList(inviter);
    }

    removeInviteFromList(inviter) {
        let currInvites = this.state.gameInvites;
        let index = currInvites.indexOf(inviter);
        if (index !== -1) {
            currInvites.splice(index, 1);
            this.setState({gameInvites: currInvites});
        }
    }

    ///////////////////////////////////////////////////////

    handleSnackbarClosing() {
        this.setState({rejectResponse: ' ', showResponse: false});
    }

    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <HomeHeader onUserLoad={this.props.onUserLoad}
                            onFriendSearch={this.handleFriendSearch}
                            searchResults={this.state.searchResults}
                            searchMessage={this.state.searchMessage}
                            onSendRequest={this.handleRequestSend}
                            onRequestAccept={this.handleRequestAccept}
                            onRequestIgnore={this.handleRequestIgnore}
                            onInviteAccept={this.handleInviteAccept}
                            onInviteIgnore={this.handleInviteIgnore}
                            gameInvites={this.state.gameInvites}
                />

                <Snackbar
                    open={this.state.showResponse}
                    message={this.state.rejectResponse}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClosing}
                />
            </div>
        );
    }
}
export default HeaderSocketWrapper;

HeaderSocketWrapper.defaultProps = {};

HeaderSocketWrapper.propTypes = {
    onUserLoad: React.PropTypes.func,
};