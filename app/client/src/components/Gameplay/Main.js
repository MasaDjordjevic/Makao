/**
 * Created by Masa on 28-Dec-16.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import mainMuiTheme from '../../MainMuiTheme';
import GameActions from '../../actions/GameActions';

import GameResizeHandler from '../Game/GameResizeHandler';
import GameInitializer from './GameInitializer';
import RightSidebar from './RightSidebar';
import NoAccess from '../NoAccess';
import Auth from '../../Auth';
import io from 'socket.io-client';

var socket;
class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            gameStarted: null,
            socket: null,
        };

        this.handleGameStart = this.handleGameStart.bind(this);
        this.handleGameStarted = this.handleGameStarted.bind(this);
        this.handleAuthenticated = this.handleAuthenticated.bind(this);
    }

    handleAuthenticated(started) {
        this.setState({socket: socket});
        socket.emit('game:started', this.props.params.username);
    }

    componentDidMount() {
        socket = io('/game');
        socket.emit('authenticate', {token: Auth.getToken()});
        socket.on('authenticated', this.handleAuthenticated);
        socket.on('unauthorized', () => alert('nope'));
        socket.on('game:started', this.handleGameStarted)

    }

    handleGameStarted(started){
        this.setState({gameStarted:started});
    }

    handleGameStart() {
        this.setState({gameStarted: true});
    }

    get styles() {

        return {
            container: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                overflow: 'hidden',
            },
            game: {
                width: '100%',
                height: '100%',
                padding: '1% 1% 0 1%',
                boxSizing: 'border-box',
            },
            rightSidebar: {}
        }
    }


    render() {
        if (this.state.gameStarted === null) return <NoAccess />;
        return (
            <div style={this.styles.container}>
                <MuiThemeProvider muiTheme={getMuiTheme(mainMuiTheme)}>
                    <div style={this.styles.container}>
                        <div style={this.styles.game}>
                            {this.state.gameStarted ?
                                <GameResizeHandler creatorUsername={this.props.params.username}
                                                   socket={this.state.socket}/> :
                                <GameInitializer creatorUsername={this.props.params.username}
                                                 onGameStart={this.handleGameStart}/>}
                        </div>
                        <RightSidebar creatorUsername={this.props.params.username} socket={this.state.socket}/>
                    </div>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Main;
