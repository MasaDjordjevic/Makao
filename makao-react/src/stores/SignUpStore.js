import alt from '../alt';
import SignupActions from '../actions/SignupActions';

class SignupStore {
    constructor() {
        this.bindActions(SignupActions);
        this.success = false;
        this.user = {};
        this.msg = ' ';
    }

    onSignup(data) {
        this.success = data.success;
        this.msg = data.msg;
        this.user = data.user;
        if (!this.msg) {
            this.msg = ' ';
        }
    }
}

export default alt.createStore(SignupStore);
