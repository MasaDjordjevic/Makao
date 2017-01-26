/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardSet from '../Card/CardSet';
import Card from '../Card/Card';
import Talon from './Talon';
import Opponents from './Opponents';
import _ from 'lodash';
import GlobalVariables from '../Gameplay/GlobalVariables';
import UserInfo from './UserInfo';
import ScoresWrapper from './ScoresWrapper';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            playerCards: [
                {id: 1, cardNumber: '10'},
                {id: 2, cardNumber: '13'},
                {id: 3, cardNumber: '5'},
                {id: 4, cardNumber: '7'},
                {id: 5, cardNumber: '8'},
            ],
            playerOnMoveId: 1,
            myCards: [
                new Card("spades", "2"),
                new Card("spades", "7"),
                new Card("diamonds", "1"),
                new Card("spades", "12"),
                new Card("spades", "13"),
                new Card("spades", "1"),
                new Card("diamonds", "2"),
                new Card("diamonds", "13"),
                new Card("clubs", "1"),
                new Card("clubs", "2"),
                new Card("clubs", "10"),
                new Card("clubs", "14"),
                new Card("hearts", "3"),
                new Card("hearts", "12"),
                new Card("spades", "2"),
                new Card("spades", "7"),
                new Card("diamonds", "1"),
                new Card("spades", "12"),
                new Card("spades", "13"),
                new Card("spades", "1"),
                new Card("diamonds", "2"),
                new Card("diamonds", "13"),
                new Card("clubs", "1"),
                new Card("clubs", "2"),
                new Card("clubs", "10"),
                new Card("clubs", "14"),
                new Card("hearts", "3"),
                new Card("hearts", "12"),
            ],
            pile: [],

        };


        this.handleDraw = this.handleDraw.bind(this);

    }

    get players() {
        const playersById = GlobalVariables.playersById;
        let playerCards = this.state.playerCards.slice();
        playerCards.map((pc, i) => pc.name = playersById[pc.id].name);

        return playerCards;
    }



    playMove(playerId, card) {
        if (playerId === GlobalVariables.userId) {
            const myCards = this.state.myCards.slice();
            myCards.splice(myCards.indexOf(card), 1);
            this.setState({
                myCards: myCards,
            })
        }
        const players = this.state.playerCards.slice();
        players.find((player) => player.id === playerId).cardNumber--;
        const pile = this.state.pile.slice();
        pile.push(card);
        this.setState({
            playerCards: players,
            pile: pile,
        })

    }

    handleDraw() {
        alert("vucem kartu");
    }


    componentDidMount() {
        this.playMove(1, this.state.myCards[0]);
        this.playMove(2, new Card("clubs", "9"));
    }


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
                alignItems: 'center'
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
            }

        }
    }

    /*<div styles={this.styles.myCards}>
     <CardSet width={700} height={310} cards={this.state.myCards} />
     </div>
     <div styles={this.styles.myCards}>
     <CardSet width={100/3*2+100} height={100} cardNumber={100} back />
     </div>
     <div styles={this.styles.myCards}>
     <CardSet width={500} height={310} cardNumber={5} back />
     </div>
     <div>
     <Talon cardHeight={310} card={this.state.pile.slice(-1)[0]}/>
     </div>*/

    handleCardClick(card) {
        this.playMove(GlobalVariables.userId, _(this.state.myCards).find(card));
    }

    render() {
        const players = this.players;
        const playersWithoutUser = _.remove(players, (p) => p.id !== GlobalVariables.userId);
        return (
            <div style={this.styles.container}>
                <div style={this.styles.opponents}>
                    <Opponents playerHeight={this.props.dimensions.opponents}
                               players={playersWithoutUser}
                               playerOnMoveId={this.state.playerOnMoveId}/>
                </div>
                <div style={this.styles.userCardsTalon}>
                    <div style={this.styles.talon}>
                        <Talon cardHeight={this.props.dimensions.talon}
                               card={this.state.pile.slice(-1)[0]}
                               onClick={() => this.handleDraw()}/>
                    </div>
                    <div style={this.styles.userContainer}>
                        <div style={{...this.styles.spacer, ...this.styles.scores}}>
                            <ScoresWrapper showScores={this.props.dimensions.showScores}
                                           scores={this.scores}
                                           height={this.props.dimensions.userCardsHeight}/>
                        </div>
                        <div style={this.styles.myCards}>
                            <CardSet
                                onClick={(card) => this.handleCardClick(card)}
                                width={this.props.dimensions.userCardsWidth}
                                height={this.props.dimensions.userCardsHeight}
                                cards={this.state.myCards}/>
                        </div>
                        <div style={this.styles.spacer}>
                            <UserInfo style={this.styles.userInfo}
                                      myMove={this.state.playerOnMoveId === GlobalVariables.userId}/>
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
};

export default Game;