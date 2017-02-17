import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';

class EnsureAuthContainer extends React.Component {
    componentDidMount() {
        // if there's no JWT, redirect
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        }
    }

    render() {
        // render nothing if no JWT
        if (!Auth.isUserAuthenticated()) {
            return null;
        } else {
            // return this.props.children;
            return this.props.children;
        }
    }
}

export default EnsureAuthContainer;