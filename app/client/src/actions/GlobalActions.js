import alt from '../alt';

class GlobalActions {
    constructor() {
        this.generateActions(
            'update',
            'initialize',
        );
    }

    initialize() {
        return;
    };

    update(data) {
        return data;
    };
}

export default alt.createActions(GlobalActions);