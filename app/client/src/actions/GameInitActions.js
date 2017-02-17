import alt from '../alt';

class GameInitActions {
    constructor() {
        this.generateActions(
            'initGame',
            'initLobby',
            'userReady',
            'userJoined',
            'userLeft'
        );
    }
}

export default alt.createActions(GameInitActions);