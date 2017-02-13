import React from 'react';
import { browserHistory } from 'react-router';
import Auth from '../../Auth';

import GlobalStore from '../../stores/GlobalStore';
import GlobalActions from '../../actions/GlobalActions';

class EnsureAuthContainer extends React.Component {
    constructor(){
        super();

        this.state = {
            user: {},
        }
    }

    onChange = () => {
        let user = GlobalStore.getState().user;
        this.setState({user: user});
    };

    componentDidMount() {
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        } else {
            if (!GlobalStore.getState().isUserSet()) {
                GlobalActions.initialize(this.onChange);
            }
        }
    }

    render() {
        if (!this.state.user.username) return false;
        if (Auth.isUserAuthenticated()) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default EnsureAuthContainer;