import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';
import GlobalVariables from '../Gameplay/GlobalVariables';

class EnsureAuthContainer extends React.Component {

    componentDidMount() {
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        } else {
            if (!GlobalVariables.isSet()) {
                GlobalVariables.initialize();
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