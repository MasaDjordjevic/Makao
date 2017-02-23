/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardSet from '../Card/CardSet';
import Talon from './Talon';
import Opponents from './Opponents';
import UserInfo from './UserInfo';
import ScoresWrapper from './ScoresWrapper';
import JackSignPicer from './JackSignPicker';
import {getCardWidth} from '../Card/common';

class Game extends React.Component {

    get styles() {
        const talonMargin = this.props.dimensions.talon / 40;

        return {
            container: {
                position: 'relative',
                width: '100%',
                height: '100%',
            },
            myCards: {
                flexGrow: 2,
                display: 'flex',
                justifyContent: 'center',
            },
            opponents: {
                width: '100%',
                height: '100%'
            },
            talon: {
                marginBottom: talonMargin + '%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                position: 'relative',
            },
            userCardsTalon: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center'
            },
            userContainer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
            },
            timer: {
                height: 7,
            },
            spacer: {
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
            },
            scores: {
                alignSelf: 'flex-end',
                justifyContent: 'flex-start'
            },
            userInfo: {
                marginTop: '5%',
            },
            jackSignPicker: {
                width: getCardWidth(this.props.dimensions.talon),
                position: 'absolute',
                left: 0,
            }


        }
    }

    get scores() {
        if (this.props.scores && this.props.scores.length) {
            return this.props.scores;
        }
        let scores = [];
        this.props.allPlayers.forEach((user) => {
            scores.push({username: user.username, score: 0});
        });
        return [scores];
    }

    render() {
        return (
            <div style={this.styles.container}>
                <Opponents
                    style={this.styles.opponents}
                    playerHeight={this.props.dimensions.opponents}
                    players={this.props.opponents}
                    playerOnMove={this.props.playerOnMove}
                    moveTime={this.props.moveTime}
                    timeLeft={this.props.timeLeft}/>

                <div style={this.styles.userCardsTalon}>
                    <div style={this.styles.talon}>
                        <Talon cardHeight={this.props.dimensions.talon}
                               card={this.props.talon}
                               onClick={this.props.onDrawClick}/>
                        {
                            this.props.jackPlayed &&
                            <JackSignPicer style={this.styles.jackSignPicker}
                                           onPick={this.props.onJackSignPicked}/>
                        }
                    </div>
                    <div style={this.styles.userContainer}>
                        <ScoresWrapper
                            style={{...this.styles.spacer, ...this.styles.scores}}
                            showScores={this.props.dimensions.showScores}
                            height={this.props.dimensions.userCardsHeight}
                            scores={this.scores}/>

                        <div style={this.styles.myCards}>
                            <CardSet
                                onClick={(card) => this.props.onCardClick(card)}
                                width={this.props.dimensions.userCardsWidth}
                                height={this.props.dimensions.userCardsHeight}
                                cards={this.props.myCards}/>
                        </div>
                        <div style={this.styles.spacer}>
                            <UserInfo style={this.styles.userInfo}
                                      myMove={this.props.myMove}
                                      enableNext={this.props.enableNext}
                                      onNext={this.props.onNext}
                                      length={this.props.moveTime}
                                      reset={this.props.resetTimer}
                                      timeLeft={this.props.timeLeft}/>
                        </div>
                    </div>
                </div>
            </div>
        )
            ;
    }
}


Game.PropTypes = {
    dimensions: React.PropTypes.object,
    myMove: React.PropTypes.object,
    opponents: React.PropTypes.array,
    allPlayers: React.PropTypes.array,
    playerOnMove: React.PropTypes.string,
    myCards: React.PropTypes.array,
    Talon: React.PropTypes.object,
    scores: React.PropTypes.array,
    jackPlayed: React.PropTypes.bool,
    onDrawClick: React.PropTypes.func,
    onCardClick: React.PropTypes.func,
    onJackSignPicked: React.PropTypes.func,
    onNext: React.PropTypes.func,
    enableNext: React.PropTypes.bool,
    moveTime: React.PropTypes.number,
    resetTimer: React.PropTypes.bool,
    timeLeft: React.PropTypes.number,
};

export default Game;