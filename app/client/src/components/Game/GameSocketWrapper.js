import React from 'react';
import _ from 'lodash';
import AuthStore from '../../stores/AuthStore';
import io from 'socket.io-client';
import GameActions from '../../actions/GameActions';
import Card from '../Card/Card';
import Game from '../Game/Game';
import Snackbar from 'material-ui/Snackbar';


var socket;

class GameSocketWrapper extends React.Component {

    constructor() {
        super();
        this.state = {
            me: AuthStore.getState().user,
            players: [],
            playerOnMove: '',
            myCards: [],
            openStack: [],
            jackPlayed: false,
            snackbarOpen: false,
        };

        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleDrawClick = this.handleDrawClick.bind(this);
        this.handleJackSignPicked = this.handleJackSignPicked.bind(this);
        this.handleNext = this.handleNext.bind(this);

        this.handleSocketInit = this.handleSocketInit.bind(this);
        this.handleUserJoin = this.handleUserJoin.bind(this);
        this.handleUserLeft = this.handleUserLeft.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        this.handleGetCards = this.handleGetCards.bind(this);
        this.handleNewLog = this.handleNewLog.bind(this);

        this.handleMovePlayed = this.handleMovePlayed.bind(this);
        this.handlePlayerOnMove = this.handlePlayerOnMove.bind(this);
    }

    handleNewLog(log){
        GameActions.addLogEntry(log);
    }

    handlePlayerOnMove(username) {
        this.setState({playerOnMove: username});
    };

    handleNext() {
        if (this.state.playerOnMove !== this.state.me.username) {
            this.setState({snackbarOpen:true});
            return;
        }
        socket.emit('play:pass');
    }

    handleJackSignPicked(sign) {
        const pile = this.state.openStack.slice();
        let card = pile[pile.length - 1];
        card.jackSymbol = sign;
        this.setState({
            openStack: pile,
            jackPlayed: false,
        });

        socket.emit('play:move', card);
    }

    handleCardClick(card) {
        if (this.state.playerOnMove !== this.state.me.username) {
            this.setState({snackbarOpen:true});
            return;
        }
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
        if (typeof(card) !== typeof(Card)) {
            card = new Card(card);
        }
        pile.push(card);
        this.setState({
            players: players,
            openStack: pile,
        });


        if (!jackPlayed && myMove) {
            socket.emit('play:move', card);
        }
    }

    handleDrawClick() {
        if (this.state.playerOnMove !== this.state.me.username) {
            this.setState({snackbarOpen: true});
            return;
        }
        socket.emit('play:draw', 1);
    }

    handleGetCards(cards) {
        let myCards = this.state.myCards.slice();
        myCards = myCards.concat(cards.map((card) => new Card(card)));
        this.setState({myCards: myCards});
    }

    handleDraw(username, cardsNumber) {
        let players = this.state.players.slice();
        players.find((player) => player.username === username).cardNumber += cardsNumber;
        this.setState({players: players});
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
        if (user) {
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
        this.setState({players: players, myCards: cards, openStack: pile, playerOnMove: data.playerOnMove});
    }


    componentDidMount() {
        socket = io('/game');
        socket.emit('join', this.props.creatorUsername, this.state.me.username);
        socket.on('init', this.handleSocketInit);
        socket.on('user:join', this.handleUserJoin);
        socket.on('user:left', this.handleUserLeft);
        socket.on('play:move', this.handleMovePlayed);
        socket.on('play:draw', this.handleDraw);
        socket.on('play:get', this.handleGetCards);
        socket.on('play:playerOnMove', this.handlePlayerOnMove);
        socket.on('log:new', this.handleNewLog);
    }


    get styles() {
        return {
            container: {
                width: '100%',
                height: '100%',
            }
        }
    }

    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };

    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(players, (p) => p.username !== this.state.me.username);
        let myCards = this.state.myCards.slice();
        myCards = _.sortBy(myCards, ['symbol', 'number']);
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Game dimensions={this.props.dimensions}
                      myMove={this.state.playerOnMove === this.state.me.username}
                      opponents={playersWithoutUser}
                      playerOnMove={this.state.playerOnMove}
                      myCards={myCards}
                      talon={this.state.openStack.slice(-1)[0]}
                      jackPlayed={this.state.jackPlayed}
                      onDrawClick={this.handleDrawClick}
                      onCardClick={this.handleCardClick}
                      onJackSignPicked={this.handleJackSignPicked}
                      onNext={this.handleNext} />
                <Snackbar
                    open={this.state.snackbarOpen}
                    message="Not your tourn"
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}
export default GameSocketWrapper;

GameSocketWrapper.defaultProps = {};

GameSocketWrapper.propTypes = {};