import React from 'react';
import _ from 'lodash';
import Snackbar from 'material-ui/Snackbar';
import Game from './Game';

class CorrectMoveWrapper extends React.Component {
    constructor() {
        super();
        this.state = {
            snackbarOpen: false,
            snackbarMessage: '',
        };

        this.isMyTurn = this.isMyTurn.bind(this);
        this.handleDrawClick = this.handleDrawClick.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    get styles() {
        return {
            container: {
                width: '100%',
                height: '100%',
            }
        }
    }

    isMyTurn() {
        if (!this.props.myMove) {
            this.setState({snackbarOpen: true, snackbarMessage: 'Not your turn'});
            return false;
        }
        return true;
    }

    handleNext() {
        if (this.isMyTurn()) {
            this.props.onNext();
        }
    }

    handleCardClick(card) {
        if (this.isMyTurn()) {
            if (card.number === this.props.talon.number || card.symbol === this.props.talon.symbol) {
                this.props.onCardClick(card);
            } else {
                this.setState({snackbarOpen: true, snackbarMessage: 'Wrong card'});
            }
        }
    }

    handleDrawClick() {
        if (this.isMyTurn()) {
            this.props.onDrawClick();
        }
    }

    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };


    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Game dimensions={this.props.dimensions}
                      myMove={this.props.myMove}
                      opponents={this.props.opponents}
                      playerOnMove={this.props.playerOnMove}
                      myCards={this.props.myCards}
                      talon={this.props.talon}
                      jackPlayed={this.props.jackPlayed}
                      onJackSignPicked={this.props.handleJackSignPicked}
                      onDrawClick={this.handleDrawClick}
                      onCardClick={this.handleCardClick}
                      onNext={this.handleNext}/>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}
export default CorrectMoveWrapper;

CorrectMoveWrapper.defaultProps = {};

CorrectMoveWrapper.propTypes = {
    dimensions: React.PropTypes.object,
    myMove: React.PropTypes.bool,
    opponents: React.PropTypes.array,
    playerOnMove: React.PropTypes.string,
    myCards: React.PropTypes.array,
    Talon: React.PropTypes.object,
    jackPlayed: React.PropTypes.bool,
    onDrawClick: React.PropTypes.func,
    onCardClick: React.PropTypes.func,
    onJackSignPicked: React.PropTypes.func,
    onNext: React.PropTypes.func,
};