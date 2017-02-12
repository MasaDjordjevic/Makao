import React from 'react';
import { browserHistory } from 'react-router';

class EnsureAuthContainer extends React.Component {
    componentDidMount() {
        if (!localStorage.getItem('jwt')) {
            browserHistory.push('/');
        }
    }

    render() {
        if (localStorage.getItem('jwt')) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default EnsureAuthContainer;