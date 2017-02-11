import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FriendPicker from '../Lobby/FriendPicker';
import Lobby from '../Lobby/Lobby';

class GameInitialiser extends React.Component {
    constructor(){
        super();

        this.state = {
            creatorId: 1,
        };

        this.handleFriendInvite = this.handleFriendInvite.bind(this);
    }

    handleFriendInvite(userId){
        console.log("invite friend: " + userId);
    }

    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <FriendPicker onPick={this.handleFriendInvite}/>
                <RaisedButton onClick={this.props.onGameStart} label="Start game" />
            </div>
        );
    }
}
export default GameInitialiser;

GameInitialiser.defaultProps = {};

GameInitialiser.propTypes = {
    onGameStart: React.PropTypes.func
};