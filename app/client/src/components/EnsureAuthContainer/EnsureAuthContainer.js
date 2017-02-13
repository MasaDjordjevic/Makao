import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';
import AuthActions from '../../actions/AuthActions';
import AuthStore from '../../stores/AuthStore';

class EnsureAuthContainer extends React.Component {

    componentWillMount() {
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        } else {
            if (_.isEmpty(AuthStore.getState().user)) {
                AuthActions.getUserData();
            }
        }
    }

    render() {
        if (Auth.isUserAuthenticated()) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default EnsureAuthContainer;