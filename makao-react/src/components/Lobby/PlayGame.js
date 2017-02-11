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
                height: 500,
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
                            <JoinGame />
                        </Tab>
                        <Tab label="Create game" >
                            <CreateGame />
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