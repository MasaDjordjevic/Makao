import _ from 'lodash';
import alt from '../alt';
import GameInitActions from '../actions/GameInitActions';

class GameInitStore {
    constructor() {
        this.bindActions(GameInitActions);
        this.creatorUsername = '';
        this.rules = {}
        this.lobby = [];
        this.allUsersReady = false;
    }

    onInitGame(game) {
        this.creatorUsername = game.creator;
        this.rules = game.rules;
    }

    onInitLobby(lobbyUsers) {
        let lobby = [];
        Object.keys(lobbyUsers).forEach((usr, i) => {
            lobby.push({
                username: usr,
                ready: lobbyUsers[usr]
            });
        });
        this.lobby = lobby;
    }

    onUserReady(readyUsername) {
        _.find(this.lobby, {username: readyUsername}).ready = true;
        this.allUsersReady = _.every(this.lobby, 'ready');
    }

    onUserJoined(username) {
        let usr = _.find(this.lobby, {username: username});
        if (usr) {
            usr.ready = false;
        } else {
            this.lobby.push({username: username, ready: username === this.creatorUsername});
        }
    }

    onUserLeft(username) {
        let usr = _.findIndex(this.lobby, {username: username});
        if (usr < 0)
            return;
        this.lobby.splice(usr, 1);
    }
}

export default alt.createStore(GameInitStore);
