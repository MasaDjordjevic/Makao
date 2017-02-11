import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import JoinGame from './JoinGame';
import CreateGame from './CreateGame';

class PlayGame extends React.Component {
    constructor() {
        super();
        this.state = {
            dialogOpen: true,
        }
    }

    handleOpen = () => {
        this.setState({dialogOpen: true});
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    get styles() {
        const playButtonSize = 70;

        return {
            container: {},
            playButton: {
                width: playButtonSize,
                height: playButtonSize,
            },
            tabs: {
                height: '70%',
            },
            dialogBody:{
                maxHeight: '70%',
                height: '70%',
            },
            dialogStyle: {
                width: '80%',
                maxWidth: 'none',
                maxHeight: '70%',
                height: '70%',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
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
                    bodyStyle={this.styles.dialogBody}
                    autoScrollBodyContent={true}
                >
                    <Tabs style={this.styles.tabs}>
                        <Tab label="Join game">
                            <JoinGame/>
                        </Tab>
                        <Tab label="Create game">
                            <CreateGame/>
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