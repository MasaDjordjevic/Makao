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
            draw: false,
            jackPlayed: false,

            //when 1 is played
            resetTimer: false,
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

            //ako je na talonu dvojka karo moras da bacis kartu koju si izvuko
            let must = _.filter(this.props.myCards, 'mustPlay');
            if (must.length > 0) {
                this.setState({snackbarOpen: true, snackbarMessage: '2 diamonds, you must play the card'});
                return;
            }

            this.setState({draw: false});
            this.props.onNext();
        }
    }

    handleCardClick(card) {
        if (this.isMyTurn()) {

            let talon = this.props.talon;

            let must = _.filter(this.props.myCards, 'mustPlay');
            if (talon.number === '2' && talon.symbol === 'diamonds') {
                let findCard = _.find(must, card);
                if (!findCard) {
                    this.setState({snackbarOpen: true, snackbarMessage: 'must play'});
                    return;
                } else {
                    if (this.state.draw) { //moras da kupis
                        this.setState({jackPlayed: false, draw: false, resetTimer: card.number === '1'});
                        this.props.onCardClick(card, true);
                        return;
                    } else {
                        this.setState({snackbarOpen: true, snackbarMessage: '2 diamonds, draw'});
                        return;
                    }
                }
            }


            //na sedmicu moze samo sedmica ako nije vuko i ako neko drugi nije vuko
            if (!this.props.sevenDrawed && (!this.state.draw && talon.number === '7' && card.number !== '7')) {
                this.setState({snackbarOpen: true, snackbarMessage: '7 na 7'});
                return;
            }
            //mora da se poklopi broj i znak
            //zaca moze uvek da se baci

            if (card.number === '12' || card.number === talon.number || (talon.jackSymbol ? card.symbol === talon.jackSymbol : card.symbol === talon.symbol)) {
                this.setState({draw: false, jackPlayed: true, resetTimer: card.number === '1'});
                this.props.onCardClick(card);
            } else {
                this.setState({snackbarOpen: true, snackbarMessage: 'Wrong card'});
            }
        }
    }

    handleDrawClick() {
        if (this.isMyTurn() && !this.canPass) {
            this.setState({draw: true});
            this.props.onDrawClick();
        } else {
            this.setState({snackbarOpen: true, snackbarMessage: "Can't draw"});
        }
    }

    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };

    get jackPlayed() {
        if (!this.state.jackPlayed) {
            return false;
        } else {
            return this.props.jackPlayed;
        }
    }

    get canPass() {
        if (this.props.talon && this.props.talon.number === '1') {
            return false;
        }
        return this.state.draw;
    }

    render() {
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Game dimensions={this.props.dimensions}
                      myMove={this.props.myMove}
                      enableNext={this.canPass}
                      opponents={this.props.opponents}
                      allPlayers={this.props.allPlayers}
                      playerOnMove={this.props.playerOnMove}
                      myCards={this.props.myCards}
                      talon={this.props.talon}
                      scores={this.props.scores}
                      moveTime={this.props.moveTime}
                      jackPlayed={this.jackPlayed}
                      onJackSignPicked={this.props.onJackSignPicked}
                      onDrawClick={this.handleDrawClick}
                      onCardClick={this.handleCardClick}
                      onNext={this.handleNext}
                      resetTimer={this.state.resetTimer}
                      timeLeft={this.props.timeLeft}
                />
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
    allPlayers: React.PropTypes.array,
    playerOnMove: React.PropTypes.string,
    myCards: React.PropTypes.array,
    scores: React.PropTypes.array,
    Talon: React.PropTypes.object,
    jackPlayed: React.PropTypes.bool,
    onDrawClick: React.PropTypes.func,
    onCardClick: React.PropTypes.func,
    onJackSignPicked: React.PropTypes.func,
    onNext: React.PropTypes.func,
    sevenDrawed: React.PropTypes.bool,
    moveTime: React.PropTypes.number,
    timeLeft: React.PropTypes.number,
};