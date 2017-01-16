import React from 'react';
import CreateGame from './CreateGame';
import JoinGame from './JoinGame';

class Lobby extends React.Component {


    get styles() {
        return {
            container: {
                display: 'flex',
                width: '100%',
            }
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <CreateGame />
            </div>
        );
    }
}
export default Lobby;

Lobby.defaultProps = {};

Lobby.propTypes = {};