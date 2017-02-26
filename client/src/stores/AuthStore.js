import alt from '../alt';
import AuthActions from '../actions/AuthActions';
import Auth from '../Auth';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);
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
            Auth.authenticateUser(data.token);
        }
    }

    onSignup(data) {
        this.success = data.success;
        this.message = data.message;
        if (!this.message) {
            this.message = ' ';
        }
        if (this.success) {
            Auth.authenticateUser(data.token);
        }
    }

    onUpdateUserData(user) {
        this.user = {
            id: user.id,
            username: user.username
        }
    }

    onLogout() {
        Auth.deauthenticateUser();
        this.user = {};

    }
}

export default alt.createStore(AuthStore, 'AuthStore');
