import alt from '../alt';

class SignupActions {
    constructor() {
        this.generateActions(
            'signup'
        );
    }

    trySignup(params) {
        fetch('/signup', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            this.actions.signup(data);
        });
    }
}

export default alt.createActions(SignupActions);