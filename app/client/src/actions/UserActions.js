import alt from '../alt';

class UserActions {
    constructor() {
        this.generateActions(
            'updateUserData',
            'updateFriendList',
            'removeFriendRequest',
            'addFriendRequest',
            'receiveInvite',
            'clearUser'
        );
    }
}

export default alt.createActions(UserActions);