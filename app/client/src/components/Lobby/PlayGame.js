import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import JoinGame from './JoinGame';
import CreateGame from './CreateGame';
import {redColor} from '../Card/common';

class PlayGame extends React.Component {
    constructor() {
        super();
        this.state = {
            dialogOpen: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen = () => {
        this.setState({dialogOpen: true});
    };

    handleClose = () => {
        this.setState({dialogOpen: false});
    };

    handleCreate = () => {
        this.handleClose();
        this.props.onCreate();
    };

    get styles() {

        return {
            container: {},
            playButton: {
                color: 'white',
                backgroundColor: redColor,
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
                <FlatButton label="PLAY MAKAO"
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
                            <JoinGame games={this.props.gameList}/>
                        </Tab>
                        <Tab label="Create game">
                            <CreateGame onCreate={this.handleCreate}/>
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