/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../alt';
import LoginActions from '../actions/LoginActions';

class LoginStore {
    constructor() {
        this.bindActions(LoginActions);
        this.success = false;
        this.user = {};
        this.msg = ' ';
    }

    onLogin(data) {
        this.success = data.success;
        this.user = data.user;
        this.msg = data.msg;
        if (!this.msg) {
            this.msg = ' ';
        }
    }
}

export default alt.createStore(LoginStore);
