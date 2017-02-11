import React from 'react';

class PlayGame extends React.Component {
    get styles() {
        return {
            container: {}
        }
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>

            </div>
        );
    }
}
export default PlayGame;

PlayGame.defaultProps = {};

PlayGame.propTypes = {};