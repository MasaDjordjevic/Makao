import React from 'react';

class JoinGame extends React.Component {
    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                Join
            </div>
        );
    }
}
export default JoinGame;

JoinGame.defaultProps = {};

JoinGame.propTypes = {};