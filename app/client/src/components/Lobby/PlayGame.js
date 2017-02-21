import React from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import JoinGame from './JoinGame';
import CreateGame from './CreateGame';
import UserStore from '../../stores/UserStore';
import Auth from '../../Auth';
import io from 'socket.io-client';

var socket;

class PlayGame extends React.Component {
    constructor() {
        super();
        this.state = {
            dialogOpen: false,
            joinGameList: []
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.updateGameList = this.updateGameList.bind(this);
    }

    updateGameList(newGames) {
        this.setState({ joinGameList: newGames });
    }

    handleOpen = () => {
        var that = this;
        socket = io('/play');
        socket.on('connect', () => {
            socket.emit('authenticate', { token: Auth.getToken() });
            socket.on('authenticated', () => {
                socket.emit('game:list');
                socket.on('game:list', (newGames) => {
                    that.updateGameList(newGames);
                });
                socket.on('game:created', (game) => {
                    browserHistory.push('/game/' + UserStore.getState().username);
                });
                socket.on('game:failed', (reason) => {
                    alert('Game creation failed: ' + reason);
                });
            })
            socket.on('unauthorized', (msg) => {
                alert(JSON.stringify(msg.data));
            })
        });
        that.setState({dialogOpen: true});
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
        socket.disconnect();
    };

    handleCreate = (rules) => {
        socket.emit('game:create', rules);
    }

    get styles() {
        const playButtonSize = 70;

        return {
            container: {},
            playButton: {
                width: playButtonSize,
                height: playButtonSize,
            },
            tabs: {
                height: 500,
                marginTop: 12,
            },
            dialogStyle: {
                width: '70%',
                maxWidth: 600,

                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            },
            height100: {
                height: '100%',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <RaisedButton label="PLAY"
                              style={this.styles.playButton}
                              onTouchTap={this.handleOpen}/>

                <Dialog
                    title="Play game"
                    modal={false}
                    contentStyle={this.styles.dialogStyle}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <Tabs contentContainerStyle={this.styles.tabs}
                          tabTemplateStyle={this.styles.height100}>
                        <Tab label="Join game">
                            <JoinGame games={this.state.joinGameList}/>
                        </Tab>
                        <Tab label="Create game">
                            <CreateGame onCreate={this.handleCreate} />
                        </Tab>
                    </Tabs>
                </Dialog>
            </div>
        );
    }
}
export default PlayGame;

PlayGame.defaultProps = {};

PlayGame.propTypes = {};