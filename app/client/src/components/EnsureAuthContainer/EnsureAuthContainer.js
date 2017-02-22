import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';
import HomeHeaderSocketWrapper from '../Home/Header/HomeHeaderSocketWrapper';
import Auth from '../../Auth';

class EnsureAuthContainer extends React.Component {
    constructor() {
        super();
        this.state = { userLoaded: false };

        this.handleUserLoaded = this.handleUserLoaded.bind(this);
    }

    componentDidMount() {
        // if there's no JWT, redirect
        if (!Auth.isUserAuthenticated() && !this.state.userLoaded) {
            browserHistory.push('/');
        }
    }

    handleUserLoaded() {
        this.setState({ userLoaded: true });
    }

    get styles() {
        return ({
                container: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                },
            });
    }

    render() {
        // render nothing if no JWT
        if (!Auth.isUserAuthenticated()) {
            return null;
        } else {
            return (
                <div style={this.styles.container}>
                    <HomeHeaderSocketWrapper onUserLoad={this.handleUserLoaded}/>
                    {this.state.userLoaded && this.props.children}
                </div>
            )
        }
    }
}

export default EnsureAuthContainer;