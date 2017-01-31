/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../alt';

class LoginActions {
    constructor() {
        this.generateActions(
            'loginSuccess',
            'loginFail'
        );
    }

    login(params) {
        fetch('/', {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.redirect) {
                this.actions.loginSuccess(data.redirect);
            } else {
                this.actions.loginFail(data.msg);
            }
        });
    }
}
export default alt.createActions(LoginActions);
