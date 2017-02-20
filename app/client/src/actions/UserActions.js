import alt from '../alt';

class UserActions {
    constructor() {
        this.generateActions(
            'updateUserData',
            'updateFriendList',
            'removeFriendRequest',
            'receiveInvite',
            'clearUser'
        );
    }
}

export default alt.createActions(UserActions);