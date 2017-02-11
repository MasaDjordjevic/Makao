import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';
import RulesSetter from '../Lobby/Rules';

class GameInitialiser extends React.Component {
    constructor() {
        super();

        this.state = {
            creatorId: 1,
            rules: {
                gameLimit: 150,
                timeLimit: 30,
                playerNumberMin: 2,
                playerNumberMax: 6,
                deckNumber: 1,
                rankFilter: 15,
                private: 1
            }
        };

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
    }

    handleFriendInvite(userId) {
        console.log("invite friend: " + userId);
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
                minWidth: 450,
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
        const inviteFriends = <div style={this.styles.section}>
            <h3 style={this.styles.title}>Invite friends</h3>
            <FriendPicker onPick={this.handleFriendInvite}/>
        </div>;

        const rules =  <div style={this.styles.section}>
            <h3 style={this.styles.title}>Rules</h3>
            <RulesSetter rules={this.state.rules} />
        </div>
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.playersContainer}>
                    {
                        false ? inviteFriends : rules
                    }
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Lobby</h3>
                        <Lobby />
                    </div>
                </div>
                <RaisedButton onClick={this.props.onGameStart} label="Start game"/>
            </div>
        );
    }
}
export default GameInitialiser;

GameInitialiser.defaultProps = {};

GameInitialiser.propTypes = {
    onGameStart: React.PropTypes.func
};