import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);
        this.username = '';
        this.id = '';
        this.friends = [];
        this.friendRequests = [];
        this.stats = {
            averageTimeSpent: 0,
            timeSpent: [0],
            scores: [0],
            totalScore: 0,
            gamesLeft: 0
        };
        this.leaderboards = {
            global: [],
            friends: [],
            meGlobal: 0,
            meFriends: 0
        };
    }

    updateUserData(data) {
        this.username = data.username;
        this.id = data.id;
        this.friends = data.friends;
        this.friendRequests = data.friendRequests;
    }

    updateUserStats(stats) {
        this.stats = stats;
    }

    updateLeaderboards(leaderboards) {
        this.leaderboards = leaderboards;
    }

    updateFriendList(friends) {
        this.friends = this.friends.concat(friends);
    }

    removeFriendRequest(requestUsername) {
        let index = this.friendRequests.indexOf(requestUsername);
        if (index !== -1) {
            this.friendRequests.splice(index, 1);
        }
    }

    addFriendRequest(sender) {
        this.friendRequests.push(sender);
    }

    clearUser() {
        this.username = '';
        this.id = '';
        this.friends = [];
    }
}

export default alt.createStore(UserStore, 'UserStore');
