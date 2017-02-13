import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';
import AuthActions from '../../actions/AuthActions';
import AuthStore from '../../stores/AuthStore';

class EnsureAuthContainer extends React.Component {
    constructor(){
        super();
        this.state = {
            user: AuthStore.getState().user
        }
    }

    onChange = () => {
        this.setState({ user: AuthStore.getState() });
    };

    componentDidMount() {
        AuthStore.listen(this.onChange);
        // if there's no JWT, redirect
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        } // if there is a JWT but no user set, try set it
        else if (_.isEmpty(AuthStore.getState().user)) {
            AuthActions.getUserData();
        }
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onChange);
    }

    render() {
        // render nothing if no JWT or empty user
        if (!Auth.isUserAuthenticated() || _.isEmpty(this.state.user)) {
            return null;
        } else {
            return this.props.children;
        }
    }
}

export default EnsureAuthContainer;