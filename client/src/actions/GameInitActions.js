import alt from '../alt';

class GameInitActions {
    constructor() {
        this.generateActions(
            'initLobbyAndRules',
            'userReady',
            'userJoined',
            'userLeft'
        );
    }
}

export default alt.createActions(GameInitActions);