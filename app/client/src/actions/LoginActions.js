/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../alt';

class LoginActions {
    constructor() {
        this.generateActions(
            'login'
        );
    }

    tryLogin(params) {
        fetch('/auth/login', {
            credentials: 'include',
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

export default alt.createActions(LoginActions);