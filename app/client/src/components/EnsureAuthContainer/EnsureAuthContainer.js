import React from 'react';
import { browserHistory } from 'react-router';

class EnsureAuthContainer extends React.Component {

    get jwt(){
        return localStorage.getItem('jwt');
    }

    componentDidMount() {
        if (!this.jwt) {
            browserHistory.push('/');
        }
    }

    render() {
        if (this.jwt) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default EnsureAuthContainer;