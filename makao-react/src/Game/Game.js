/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import Card from '../Card/Card';

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
            ],
            pile: [],
        };
    }

    playMove(playerId, card){
        if(playerId !== this.state.userId){
            const players = this.state.players.slice();
            players.find((player) => player.id === playerId).cardNumber--;
            const pile = this.state.pile.slice();
            pile.push(card);
            this.setState({
                players: players,
                pile: pile,
            })
        }
    }

    render(){
        return(
            <div>
                {this.state.players.map((player, i) =>
                    <span key={i.toString()}>{player.name} {player.cardNumber}</span>
                )}
            </div>
        );
    }
}

export default Game;