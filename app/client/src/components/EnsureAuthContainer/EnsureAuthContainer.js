import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';

class EnsureAuthContainer extends React.Component {

    componentDidMount() {
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        } else {

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