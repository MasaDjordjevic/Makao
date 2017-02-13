import alt from '../alt';
import GlobalActions from '../actions/GlobalActions';
import Auth from '../Auth';
class GlobalStore{
    constructor(){
        this.bindActions(GlobalActions);
        this.user = null;
        this.isUserSet = () => {return !!this.user}
    }

    onUpdate(data){
        this.data = data;
    }


    onInitialize(callbackFunction){
        // surpress emitting change event if already set
        /*if (this.data.username) {
            return false;
        }
*/
        fetch('/user/data', {
            headers: { 'Authorization': 'bearer ' + Auth.getToken() },
        })
            .then((res) => {
                return res.json();
            }).then((user) => {
            this.user = {};
            this.user.usedId = user.id;
            this.user.username = user.username;
            this.setState({user: user});

            callbackFunction();
        });
    }
}

export default alt.createStore(GlobalStore);
