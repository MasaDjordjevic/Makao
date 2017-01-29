/**
 * Created by Masa on 29-Jan-17.
 */
import alt from '../components/App/alt';
import LoginActions from '../actions/LoginActions';

class LoginStore{
    constructor(){
        this.bindActions(LoginActions);
        this.response  = "";
    }

    onLoginSuccess(data){
        this.response = data.res;
    }

    onLoginFail(jqXhr){
        console.log(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
        this.response = "doslo je do greske";
    }
}

export default alt.createStore(LoginStore);