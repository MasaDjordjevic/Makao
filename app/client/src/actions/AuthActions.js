import alt from '../alt';
import Auth from '../Auth';

class AuthActions {
    constructor() {
        this.generateActions(
            'login',
            'updateUserData',
            'logout'
        );
    }

    tryLogin(params) {
        fetch('/auth/login', {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.actions.login(data);
        });
    }

    trySignup(params) {
        fetch('/auth/signup', {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.actions.login(data);
        });
    }

    getUserData() {
        fetch('/user/data', {
            headers: { 'Authorization': 'bearer ' + Auth.getToken() },
        }).then((res) => {
            return res.json();
        }).then((user) => {
            this.actions.updateUserData(user);
        });
    }

    // just dispatches the action further
    logout() {

    }
}

export default alt.createActions(AuthActions);