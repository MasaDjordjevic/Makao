/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import CardSet from '../Card/CardSet';
import Card from '../Card/Card';
import Talon from './Talon';
import Opponents from './Opponents';
import _ from 'lodash';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            players: [
                {id: 1, name: 'Masa', cardNumber: '10'},
                {id: 2, name: 'Jajac', cardNumber: '13'},
                {id: 3, name: 'Nikolica', cardNumber: '5'},
                {id: 4, name: 'Nemanja', cardNumber: '7'},
                {id: 5, name: 'Darko', cardNumber: '8'},
                {id: 5, name: 'Darko', cardNumber: '8'},
            ],
            playerOnMoveId: 1,
            userId: 1,
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


    }

    playMove(playerId, card) {
        if (playerId === this.state.userId) {
            const myCards = this.state.myCards.slice();
            myCards.splice(myCards.indexOf(card), 1);
            this.setState({
                myCards: myCards,
            })
        }
        const players = this.state.players.slice();
        players.find((player) => player.id === playerId).cardNumber--;
        const pile = this.state.pile.slice();
        pile.push(card);
        this.setState({
            players: players,
            pile: pile,
        })

    }

    componentDidMount() {
        this.playMove(1, this.state.myCards[0]);
        this.playMove(2, new Card("clubs", "9"));
    }

    get styles() {
        return {
            container: {
                position: 'relative',
            },
            myCards: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
            },
            opponents: {},
            talon: {
                top: '-2%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            absolute: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }
        }
    }

    /*<div style={this.styles.myCards}>
     <CardSet width={700} height={310} cards={this.state.myCards} />
     </div>
     <div style={this.styles.myCards}>
     <CardSet width={100/3*2+100} height={100} cardNumber={100} back />
     </div>
     <div style={this.styles.myCards}>
     <CardSet width={500} height={310} cardNumber={5} back />
     </div>
     <div>
     <Talon cardHeight={310} card={this.state.pile.slice(-1)[0]}/>
     </div>*/

    handleCardClick(card){
        this.playMove(this.state.userId, _(this.state.myCards).find(card));
    }

    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(players, (p) => p.id !== this.state.userId);
        return (
            <div style={this.styles.container}>
                <div style={this.styles.opponents}>
                    <Opponents playerHeight={150} players={playersWithoutUser}/>
                </div>
                <div style={{...this.styles.absolute, ...this.styles.talon}}>
                    <Talon cardHeight={270} card={this.state.pile.slice(-1)[0]}/>
                </div>
                <div style={{...this.styles.myCards, ...this.styles.absolute}}>
                    <CardSet
                        onClick={(card)=>this.handleCardClick(card)}
                        width={700}
                        height={250}
                        cards={this.state.myCards} />
                </div>
            </div>
        );
    }
}

export default Game;