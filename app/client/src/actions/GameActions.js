import alt from '../alt';
import Auth from '../Auth';

class GameActions {
    constructor(){
    }

    createGame(rules, callbackFunction){
        fetch('/createGame', {
            headers: {'Content-Type': 'application/json',  'Authorization': 'bearer ' + Auth.getToken()},
            method: "POST",
            body: JSON.stringify({rules: rules})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            callbackFunction(data.success);
        })
    }
}

export default alt.createActions(GameActions);