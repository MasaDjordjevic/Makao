import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);
        this.username = '';
        this.id = '';
        this.friends = [];
        this.friendRequests = [];
    }

    updateUserData(data) {
        this.username = data.username;
        this.id = data.id;
        this.friends = data.friends;
        this.friendRequests = data.friendRequests;
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

    receiveInvite(inviter) {

    }

    clearUser() {
        this.username = '';
        this.id = '';
        this.friends = [];
    }
}

export default alt.createStore(UserStore);
