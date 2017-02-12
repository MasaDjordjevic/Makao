/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../alt';
import LoginActions from '../actions/LoginActions';
import Auth from '../Auth';

class LoginStore {
    constructor() {
        this.bindActions(LoginActions);
        this.success = false;
        this.user = {};
        this.message = ' ';
    }

    onLogin(data) {
        this.success = data.success;
        this.message = data.message;
        if (!this.message) {
            this.message = ' ';
        }
        if (this.success) {
            this.user = data.user;
            Auth.authenticateUser(data.token);
        }
    }
}

export default alt.createStore(LoginStore);
