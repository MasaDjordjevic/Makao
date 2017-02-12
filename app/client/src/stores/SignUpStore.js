import alt from '../alt';
import SignupActions from '../actions/SignUpActions';
import Auth from '../Auth';

class SignupStore {
    constructor() {
        this.bindActions(SignupActions);
        this.success = false;
        this.user = {};
        this.msg = ' ';
    }

    onSignup(data) {
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

export default alt.createStore(SignupStore);
