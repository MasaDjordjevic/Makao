import Games from '../Redis/Games';
import App from '../Redis/App';
import User from '../models/user';

module.exports = function (socket) {
    var socketUser = socket.decoded_token.name;
    // Socket can emit 'user:data' or any other message
    // only after being authenticated, so we're safe to continue.
    socket.on('user:data', () => {
        console.log('user ' + socketUser + ' connected to appSocket');
        App.setUserSocket(socketUser, socket.id);
        User.findByUsername(socketUser, (err, user) => {
            let userData = {
                id: user._id,
                username: user.username,
                friends: user.friends,
                friendRequests: user.friendRequests
            }
            socket.emit('user:data', userData);
        });
    });

    socket.on('friend:accept', (friendUsername) => {
        User.addFriend(socketUser, friendUsername, (err) => {
            socket.emit('friend:added', friendUsername);
        });
    });

    socket.on('friend:ignore', (friendUsername) => {
        User.removeFriendRequest(socketUser, friendUsername, (err) => {
            socket.emit('friend:ignore', friendUsername);
        });
    });

    socket.on('user:friend:requests', () => {
        User.findByUsername()
    });

    socket.on('invite:accept', (creatorUsername) => {
        // TODO redis refactor
        return;
        let gameState, lobbyCount, gameRules;
        Games.getGameState(creatorUsername)
            .then((state) => gameState = state);
        Games.getLobby(creatorUsername)
            .then((users) => lobbyCount = users.length());
        Games.getGameRules(creatorUsername)
            .then((rules) => gameRules = rules);
        if (gameState === 'lobby' && lobbyCount < gameRules.playerNumberMax) {
            console.log('user ' + socketUser + ' accepted game invite from ' + creatorUsername);
            socket.emit('invite:accept', creatorUsername);
        } else {
            // reject if the game is currently full but still in lobby
            socket.emit('invite:reject', creatorUsername);
        }
    });

    socket.on('invite:decline', (creatorUsername) => {
        console.log('user ' + socketUser + ' declined game invite from' + creatorUsername);
        // remove the invite from redis [invites]
        // no need to send anything back to user
    });

    socket.on('disconnect', () => {
        App.removeUserSocket(socketUser);
        console.log('user ' + socketUser + ' disconnected from appSocket');
    });
};
