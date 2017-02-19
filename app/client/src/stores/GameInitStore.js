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

    initLobbyAndRules(data) {
        let { creator, users, rules } = data;
        let lobby = [];
        // map {username:true, username2:false,...}
        // to  [{username, true}, {username2, false},...]
        Object.keys(users).forEach((usr, i) => {
            lobby.push({
                username: usr,
                ready: users[usr]
            });
        });
        this.creatorUsername = creator;
        this.lobby = lobby;
        this.rules = rules;
    }

    onUserReady(readyUsername) {
        _.find(this.lobby, {username: readyUsername}).ready = true;
        this.allUsersReady = _.every(this.lobby, 'ready')
                             && this.lobby.length >= this.rules.playerNumberMin;
    }

    onUserJoined(username) {
        let usr = _.find(this.lobby, {username: username});
        if (usr) {
            usr.ready = usr.username === this.creatorUsername;
        } else {
            this.lobby.push({username: username, ready: username === this.creatorUsername});
        }
        this.allUsersReady = _.every(this.lobby, 'ready')
                             && this.lobby.length >= this.rules.playerNumberMin;
    }

    onUserLeft(username) {
        let usr = _.findIndex(this.lobby, {username: username});
        if (usr < 0)
            return;
        this.lobby.splice(usr, 1);
        this.allUsersReady = _.every(this.lobby, 'ready')
                             && this.lobby.length >= this.rules.playerNumberMin;
    }
}

export default alt.createStore(GameInitStore);
