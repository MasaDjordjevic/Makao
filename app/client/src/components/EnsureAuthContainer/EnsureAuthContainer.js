import _ from 'lodash';
import React from 'react';
import {browserHistory} from 'react-router';
import Auth from '../../Auth';

class EnsureAuthContainer extends React.Component {
    componentDidMount() {
        // if there's no JWT, redirect
        if (!Auth.isUserAuthenticated()) {
            browserHistory.push('/');
        }
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
                    <HomeHeader />
                    {this.props.children}
                </div>
            )
        }
    }
}

export default EnsureAuthContainer;