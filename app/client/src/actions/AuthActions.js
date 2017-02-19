import alt from '../alt';

class AuthActions {
    constructor() {
        this.generateActions(
            'login',
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
}

export default alt.createActions(AuthActions);