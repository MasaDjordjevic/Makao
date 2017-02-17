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
import GameActions from '../../actions/GameActions';

var socket;

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            me: AuthStore.getState().user,
            players: [],
            playerOnMoveId: 1,
            myCards: [],
            openStack: [],
            jackPlayed: false
        };

        this.handleDrawClick = this.handleDrawClick.bind(this);
        this.handleJackSignPicked = this.handleJackSignPicked.bind(this);

        this.handleSocketInit = this.handleSocketInit.bind(this);
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.handleUserLeft = this.handleUserLeft.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleGetCards = this.handleGetCards.bind(this);

        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleMovePlayed = this.handleMovePlayed.bind(this);
    }

    handleJackSignPicked(sign) {
        const pile = this.state.openStack.slice();
        let card = pile[pile.length - 1];
        card.jackSymbol = sign;
        this.setState({
            openStack: pile,
            jackPlayed: false,
        });

        GameActions.addLogEntry({username: this.state.me.username, card: card});
        socket.emit('play:move', card);
    }

    handleCardClick(card) {
        this.handleMovePlayed(this.state.me.username, _.find(this.state.myCards, card));
    }

    handleMovePlayed(username, card) {
        const jackPlayed = username === this.state.me.username && card.number === "12";
        const myMove = username === this.state.me.username;
        if (myMove) {
            const myCards = this.state.myCards.slice();
            myCards.splice(myCards.indexOf(card), 1);
            this.setState({
                myCards: myCards,
                jackPlayed: jackPlayed,
            })
        }
        const players = this.state.players.slice();
        players.find((player) => player.username === username).cardNumber--;
        const pile = this.state.openStack.slice();
        if(typeof(card) !==  typeof(Card)){
            card = new Card(card);
        }
        pile.push(card);
        this.setState({
            players: players,
            openStack: pile,
        });

        if(!jackPlayed){
            GameActions.addLogEntry({username: username, card: card});
        }

        if (!jackPlayed && myMove) {
            socket.emit('play:move', card);
        }
    }

    handleDrawClick(){
        GameActions.addLogEntry({username: this.state.me.username, draw: 1});
        socket.emit('play:draw', 1);
    }

    handleGetCards(cards){
        let myCards = this.state.myCards.slice();
        myCards = myCards.concat(cards.map((card)=> new Card(card)));
        this.setState({myCards: myCards});
    }

    handleDraw(username, cardsNumber) {
        let players = this.state.players.slice();
        players.find((player) => player.username === username).cardNumber += cardsNumber;
        this.setState({players: players});

        GameActions.addLogEntry({username: username, draw: cardsNumber});
    }

    handleUserJoin(user) {
        let users = this.state.players.slice();
        let usr = _.find(users, (p) => p.username === user.username);
        if (usr) {
            usr.online = 'online';
        } else {
            users.push(user);
        }
        this.setState({players: users});
    }

    handleUserLeft(username) {
        let users = this.state.players.slice();
        let user = _.find(users, (p) => p.username === username);
        if(user) {
            user.online = false;
            this.setState({players: users});
        }
    }

    handleSocketInit(data) {
        let players = [];
        Object.keys(data.players).forEach((username, i) => {
            players.push({...{username: username}, ...data.players[username]});
        });
        let pile = [...this.state.openStack, new Card(data.talon)];
        let cards = data.cards.map((card) => new Card(card));
        this.setState({players: players, myCards: cards, openStack: pile});
    }


    componentDidMount() {
        //this.handleMovePlayed(1, this.state.myCards[0]);
        //this.handleMovePlayed(2, new Card("clubs", "9"));
        socket = io('/game');
        socket.emit('join', this.props.creatorUsername, this.state.me.username);
        socket.on('init', this.handleSocketInit);
        socket.on('user:join', this.handleUserJoin);
        socket.on('user:left', this.handleUserLeft);
        socket.on('play:move', this.handleMovePlayed);
        socket.on('play:draw', this.handleDraw);
        socket.on('play:get', this.handleGetCards);
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
     <Talon cardHeight={310} card={this.state.openStack.slice(-1)[0]}/>
     </div>*/



    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(players, (p) => p.username !== this.state.me.username);
        let myCards = this.state.myCards.slice();
        myCards = _.sortBy(myCards, ['symbol', 'number']);
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
                               card={this.state.openStack.slice(-1)[0]}
                               onClick={() => this.handleDrawClick()}/>
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
                                cards={myCards}/>
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