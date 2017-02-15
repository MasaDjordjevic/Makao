/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import CardSet from '../Card/CardSet';
import Card from '../Card/Card';
import Talon from './Talon';
import Opponents from './Opponents';
import _ from 'lodash';
import AuthStore from '../../stores/AuthStore';
import UserInfo from './UserInfo';
import ScoresWrapper from './ScoresWrapper';
import JackSignPicer from './JackSignPicker';
import {getCardWidth} from '../Card/common';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/game');

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            me: AuthStore.getState().user,
            retreivedPlayers: {
                'darko': {online: true, cardNumber: '10'},
                'marko': {online: false, cardNumber: '13'},
                'kristina': {online: true, cardNumber: '5'},
                'nikola': {online: false, cardNumber: '7'},
                'pera': {online: true, cardNumber: '8'},
            },
            players: [],
            playerOnMoveId: 1,
            myCards: [
                new Card("spades", "2"),
                new Card("spades", "7"),
                new Card("diamonds", "1"),
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
            jackPlayed: false
        };


        this.handleDraw = this.handleDraw.bind(this);
        this.handleJackSignPicked = this.handleJackSignPicked.bind(this);

        this.handleSocketInit = this.handleSocketInit.bind(this);
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.handleUserLeft = this.handleUserLeft.bind(this);

    }

    handleJackSignPicked(sign) {
        const pile = this.state.pile.slice();
        pile[pile.length - 1].jackSymbol = sign;
        this.setState({
            pile: pile,
            jackPlayed: false,
        });

        //obavesti ostale o potezu
    }

    playMove(playerId, card) {
        const jackPlayed = playerId === this.state.me.id && card.number === "12";
        if (playerId === this.state.me.id) {
            const myCards = this.state.myCards.slice();
            myCards.splice(myCards.indexOf(card), 1);
            this.setState({
                myCards: myCards,
                jackPlayed: jackPlayed,
            })
        }
        const players = this.state.playerCards.slice();
        players.find((player) => player.id === playerId).cardNumber--;
        const pile = this.state.pile.slice();
        pile.push(card);
        this.setState({
            playerCards: players,
            pile: pile,
        });

        if (!jackPlayed) {
            //obavesti ostale o potezu
        }
    }

    handleDraw() {
        alert("vucem kartu");
    }

    handleUserJoin(user) {
        let users = this.state.players.slice();
        let usr = _.find(users, (p) => p.username === user.username);
        if (usr) {
            usr.online = true;
        } else {
            users.push(user);
        }
        this.setState({players: users});
    }

    handleUserLeft(username) {
        let users = this.state.players.slice();
        let user = _.find(users, (p) => p.username === username);
        user.online = false;
        this.setState({players: users});
    }

    handleSocketInit(users) {
        let players = [];
        Object.keys(users).forEach((username, i) => {
            players.push({...{username: username}, ...users[username]});
        });
        this.setState({players: players});
    }


    componentDidMount() {
        socket.emit('join', this.props.creatorUsername, this.state.me.username);
        socket.on('init', this.handleSocketInit);
        socket.on('user:join', this.handleUserJoin);
        socket.on('user:left', this.handleUserLeft);
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
        this.playMove(this.state.me.id, _(this.state.myCards).find(card));
    }

    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(players, (p) => p.username !== this.state.me.username);
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
                        {
                            this.state.jackPlayed &&
                            <JackSignPicer style={this.styles.jackSignPicker}
                                           onPick={this.handleJackSignPicked}/>
                        }
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
                                      myMove={this.state.playerOnMoveId === this.state.me.id}/>
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