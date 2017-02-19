import alt from '../alt';

class UserActions {
    constructor() {
        this.generateActions(
            'updateUserInfo',
            'updateFriendList',
            'receiveInvite',
            'clearUser'
        );
    }
}

export default alt.createActions(UserActions);