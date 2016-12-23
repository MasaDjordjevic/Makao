/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardComponent from '../Card/CardComponent';
import CardSet from '../Card/CardSet';
import Card from '../Card/Card';
import Talon from './Talon';
import Opponents from './Opponents';

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            players: [
              {id: 1, name: 'Masa', cardNumber: '10'},
              {id: 2, name: 'Jajac', cardNumber: '13'},
              {id: 3, name: 'Nikolica', cardNumber: '5'}
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

    playMove(playerId, card){
        if(playerId === this.state.userId) {
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

    componentDidMount(){
        this.playMove(1, this.state.myCards[0]);
    }
    get styles(){
        return {
            game: {

            },
            myCards: {

            },
            opponents:{

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
    render(){
        return(
            <div style={this.styles.game}>

                <Opponents />
            </div>
        );
    }
}

export default Game;