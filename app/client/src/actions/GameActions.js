import alt from '../alt';
import Auth from '../Auth';

class GameActions {
    constructor(){
        this.generateActions(
            'addLog',
            'setLogs'
        )
    }

    addLogEntry(log){
        this.actions.addLog(log);
    }

    getLogs(creatorUsername){
        fetch('/game/logs', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            method: "POST",
            body: JSON.stringify({creatorUsername: creatorUsername})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.actions.setLogs(data.logs);
        })
    }

    createGame(rules, callbackFunction){
        fetch('/game/create', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            method: "POST",
            body: JSON.stringify({rules: rules})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            callbackFunction(data.success);
        })
    };

    isGameStarted(creatorUsername, callbackFunction) {
        fetch('/game/state', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            method: "POST",
            body: JSON.stringify({creatorUsername: creatorUsername})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            callbackFunction(data.state ===  'started');
        })
    };
}

export default alt.createActions(GameActions);