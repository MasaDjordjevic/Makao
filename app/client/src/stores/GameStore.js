import alt from '../alt';
import GameActions from '../actions/GameActions';

class GameStore{
    constructor(){
        this.bindActions(GameActions);
        this.logs = [];
    }

    onAddLog(log){
        this.setState({logs: [...this.logs, log]});
    }

    onSetLogs(logs){
        this.setState({logs: logs});
    }
}

export default alt.createStore(GameStore);