/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../alt';
import LoginActions from '../actions/LoginActions';

class LoginStore{
    constructor(){
        this.bindActions(LoginActions);
        this.type = '';
        this.payload = '';
    }

    onLoginFail(msg){
        this.type = 'fail';
        this.payload = 'Failed: ' + msg;
    }

    onLoginSuccess(redirect) {
        this.type = 'success';
        this.payload = redirect;
    }
}

export default alt.createStore(LoginStore);
