import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';
import Rules from '../Lobby/Rules';
import UserStore from '../../stores/UserStore';
import GameInitStore from '../../stores/GameInitStore';

class GameInitializer extends React.Component {
    constructor() {
        super();

        this.state = {
            game: GameInitStore.getState(),
            showReady: true,
            loaded: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }

    onChange() {
        this.setState({
            game: GameInitStore.getState(),
            loaded: true
        });
    }

    handleReady() {
        this.setState({ showReady: false });
        this.props.onReady();
    }

    componentDidMount() {
        GameInitStore.listen(this.onChange);
    }

    componentWillUnmount() {
        GameInitStore.unlisten(this.onChange);
    }

    get styles() {
        return {
            container: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
            },
            playersContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            section: {
                padding: '0 16px 20px',
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            },
            title: {
                padding: '4px 16px 0px',
                fontSize: '22px',
                lineHeight: '32px',
                fontWeight: 400,
            }
        }
    }

    render() {
        if (!this.state.loaded) {
            return null;
        }
        const allowStart = this.state.game.allUsersReady;
        const myUsername = UserStore.getState().username;
        const myGame = myUsername === this.props.creatorUsername;
        const inviteFriends =
            <div style={this.styles.section}>
                <h3 style={this.styles.title}>Invite friends</h3>
                <FriendPicker onPick={this.props.onInvite}/>
            </div>;

        const rules =
            <div style={this.styles.section}>
                <h3 style={this.styles.title}>Rules</h3>
                <Rules rules={this.state.game.rules}/>
            </div>;
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.playersContainer}>
                    {
                        myUsername === this.props.creatorUsername ? inviteFriends : rules
                    }
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Lobby</h3>
                        <Lobby users={this.state.game.lobby}
                               gameCreatorUsername={this.props.creatorUsername}/>
                        {!myGame && this.state.showReady &&
                        <RaisedButton primary={true}
                                      label="ready"
                                      onClick={this.props.onReady}/> }
                    </div>
                </div>
                {myGame &&
                <RaisedButton onClick={this.props.onStart}
                              label="Start game"
                              primary={allowStart}
                              disabled={!allowStart}/> }
            </div>
        );
    }
}

export default GameInitializer;

GameInitializer.defaultProps = {};
GameInitializer.propTypes = {
    onGameStart: React.PropTypes.func
};