import React from 'react';
import _ from 'lodash';
import UserStore from '../../stores/UserStore';
import Card from '../Card/Card';
import CorrectMoveWrapper from '../Game/CorrectMoveWrapper';
import Dialog from 'material-ui/Dialog';
import {teal900} from 'material-ui/styles/colors';

class GameSocketWrapper extends React.Component {

    constructor() {
        super();
        this.state = {
            me: UserStore.getState(),
            players: [],
            playerOnMove: '',
            myCards: [],
            openStack: [],
            jackPlayed: false,
            scores: [],

            sevenDrawed: false,

            socketInit: false,
            dialogOpen: false,
            dialogMessage: "NEW HAND",
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
        this.handleNewHand = this.handleNewHand.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);

        this.handleMovePlayed = this.handleMovePlayed.bind(this);
        this.handlePlayerOnMove = this.handlePlayerOnMove.bind(this);
    }

    empty(){

    }

    handleGameOver(scores){
        this.setState({dialogOpen: true, dialogMessage: "GAME OVER", scores: scores});
        this.handleNext = this.empty;
        this.handleCardClick = this.empty;
        this.handleDrawClick = this.empty;
    }

    handlePlayerOnMove(username) {
        this.setState({playerOnMove: username});
    };

    handleNext() {
        this.props.socket.emit('play:pass');
    }

    handleJackSignPicked(sign) {
        const pile = this.state.openStack.slice();
        let card = pile[pile.length - 1];
        card.jackSymbol = sign;
        this.setState({
            openStack: pile,
            jackPlayed: false,
        });

        this.props.socket.emit('play:move', card);
    }

    handleCardClick(card, ignoreJack = false) {
        this.handleMovePlayed(this.state.me.username, _.find(this.state.myCards, card), ignoreJack);
    }

    handleMovePlayed(username, card, ignoreJack = false) {
        let jackPlayed = username === this.state.me.username && card.number === "12";

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


        if ((ignoreJack || !jackPlayed) && myMove) {
            this.props.socket.emit('play:move', card);
        }
    }

    handleDrawClick() {
        this.props.socket.emit('play:draw', 1);
    }

    handleGetCards(cards) {
        let myCards = this.state.myCards.slice();
        myCards = myCards.concat(cards.map((card) => new Card(card)));
        this.setState({myCards: myCards});
    }

    handleDraw(username, cardsNumber) {
        let players = this.state.players.slice();
        players.find((player) => player.username === username).cardNumber += cardsNumber;
        //ako je sedmica na talonu a neko je vuko
        let seven = false;
        let talon = _.last(this.state.openStack);
        if(talon.number === '7'){
            seven = true;
        }
        this.setState({players: players, sevenDrawed: seven});
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
        let pile = [new Card(data.talon)];
        let cards = data.cards.map((card) => new Card(card));
        this.setState({
            players: data.players,
            myCards: cards,
            openStack: pile,
            playerOnMove: data.playerOnMove,
            scores: data.scores
        });
    }

    handleNewHand(data){
        this.handleSocketInit(data);
        this.setState({dialogOpen: true});
        setTimeout(this.handleClose, 1000);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.socketInit && nextProps.socket) {
            this.setState({socketInit: true});
            let socket = nextProps.socket;
            socket.emit('join', this.props.creatorUsername, this.state.me.username);
            socket.on('init', this.handleSocketInit);
            socket.on('user:join', this.handleUserJoin);
            socket.on('user:left', this.handleUserLeft);
            socket.on('play:move', this.handleMovePlayed);
            socket.on('play:draw', this.handleDraw);
            socket.on('play:get', this.handleGetCards);
            socket.on('play:playerOnMove', this.handlePlayerOnMove);
            socket.on('game:newHand', this.handleNewHand);
            socket.on('game:over', this.handleGameOver);
        }
    }


    handleClose = () => {
        this.setState({dialogOpen: false});
    };


    get styles() {
        return {
            container: {
                width: '100%',
                height: '100%',
            },
            dialogBody: {
                textAlign: 'center',
                fontSize: '36px',
                fontWeight: 600,
                color: teal900,
            },
            dialogContent: {
                width: '40%'
            }
        }
    }

    render() {
        const players = this.state.players.slice();
        const playersWithoutUser = _.remove(this.state.players.slice(), (p) => p.username !== this.state.me.username);
        let myCards = this.state.myCards.slice();
        myCards = _.sortBy(myCards, ['symbol', 'number']);
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <Dialog
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                    bodyStyle={this.styles.dialogBody}
                    contentStyle={this.styles.dialogContent}
                >
                    {this.state.dialogMessage}
                </Dialog>
                <CorrectMoveWrapper dimensions={this.props.dimensions}
                                    myMove={this.state.playerOnMove === this.state.me.username}
                                    opponents={playersWithoutUser}
                                    allPlayers={players}
                                    playerOnMove={this.state.playerOnMove}
                                    myCards={myCards}
                                    talon={this.state.openStack.slice(-1)[0]}
                                    scores={this.state.scores}
                                    jackPlayed={this.state.jackPlayed}
                                    onDrawClick={this.handleDrawClick}
                                    onCardClick={this.handleCardClick}
                                    onJackSignPicked={this.handleJackSignPicked}
                                    onNext={this.handleNext}
                                    sevenDrawed={this.state.sevenDrawed}/>
            </div>
        );
    }
}
export default GameSocketWrapper;

GameSocketWrapper.defaultProps = {};

GameSocketWrapper.propTypes = {};