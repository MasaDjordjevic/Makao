import alt from '../alt';

class SignUpActions {
    constructor() {
        this.generateActions(
            'signUpSuccess',
            'signUpFail'
        );
    }

    signUp(params) {
        fetch('/signup', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.redirect) {
                this.actions.signUpSuccess(data.redirect);
            } else {
                this.actions.signUpFail(data.msg);
            }
        });
    }
}

export default alt.createActions(SignUpActions);