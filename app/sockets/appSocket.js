import Games from '../Redis/Games';
import App from '../Redis/App';
import User from '../models/user';

module.exports = function (socket, io) {
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

    // client sends friend request to someone
    socket.on('friend:request:send', (recipient) => {
        User.addFriendRequest(recipient, socketUser, (err) => {
            if (!err) {
                socket.emit('friend:request:sent');
                App.getUserSocket(recipient).then((socketid) => {
                    io.to(socketid).emit('friend:request:received', socketUser);
                });
            }
        });
    });

    socket.on('invite:accept', (creatorUsername) => {
        // first get games that didn't start and check is there a place for this player
        Games.getGame(creatorUsername).then((game) => {
            Games.getLobby(creatorUsername).then((lobby) => {
                if (lobby.length < game.rules.playerNumberMax) {
                    socket.emit('invite:accepted', creatorUsername);
                } else {
                    socket.emit('invite:rejected', 'Game lobby is full.');
                }
            }).catch((err) => {
                socket.emit('invite:rejected', 'Game has already started.');
            });
        }).catch((err) => {
            socket.emit('invite:rejected', 'Game has already finished.');
        });
    });

    socket.on('invite:ignore', (creatorUsername) => {
        Games.remInvite(creatorUsername, socketUser);
    });

    socket.on('friend:find', (username) => {
        User.findByUsername(username, (err, user) => {
            if (err || !user){
                socket.emit('friend:find', null);
            } else {
                socket.emit('friend:find', username);
            }
        });
    });

    socket.on('disconnect', () => {
        App.removeUserSocket(socketUser);
        console.log('user ' + socketUser + ' disconnected from appSocket');
    });
};
