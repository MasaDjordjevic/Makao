import alt from '../alt';

class UserActions {
    constructor() {
        this.generateActions(
            'updateUserData',
            'updateUserStats',
            'updateFriendList',
            'removeFriendRequest',
            'addFriendRequest',
            'clearUser'
        );
    }
}

export default alt.createActions(UserActions);