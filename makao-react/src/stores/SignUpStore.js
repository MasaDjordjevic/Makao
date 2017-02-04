import alt from '../alt';
import SignUpActions from '../actions/SignUpActions';

class SignUpStore{
    constructor(){
        this.bindActions(SignUpActions);
        this.type = '';
        this.payload = '';
    }

    onSignUpFail(msg){
        this.type = 'fail';
        this.payload = 'Failed: ' + msg;
    }

    onSignUpSuccess(redirect) {
        this.type = 'success';
        this.payload = redirect;
    }
}

export default alt.createStore(SignUpStore);
