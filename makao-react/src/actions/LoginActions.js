/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../components/App/alt';

class LoginActions {
    constructor() {
        this.generateActions(
            'loginSuccess',
            'loginFail'
        );
    }

    login(params) {
        fetch('/test2', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(params)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.actions.loginSuccess(data);
        }).catch((err) => {
            debugger;
            this.actions.loginFail(err);
        });
    }
}
export default alt.createActions(LoginActions);