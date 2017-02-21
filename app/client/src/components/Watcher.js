import React from 'react';
import Auth from '../Auth';
import Rules from './Lobby/Rules'
import CardSymbol from './Card/CardSymbol';
import Card from './Card/Card';
import _ from 'lodash';
import Log from './Log and Chat/Log';
import Scores from './Game/Scores';

class Watcher extends React.Component {
    constructor() {
        super();
        this.state = {
            response: null,
        }
    }

    get styles() {
        return {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%',
                height: '100%',
                paddingLeft: 10,
                boxSizing: 'border-box'
            },
            general: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                height: '100%'
            },
            section: {
                marginTop: 15,
                padding: '0 16px 20px',
                backgroundColor: 'white',
                boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
            },
            title: {
                padding: '4px 16px 0px',
                fontSize: '22px',
                lineHeight: '32px',
                fontWeight: 400,
            },
            users: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            },
            user: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'

            },
            subsection: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
            userProp: {
                marginLeft: 10,
            },
            cardsContainer: {
                display: 'flex',
                flexDirection: 'column',
                marginLeft: 10,
            },
            card: {
                display: 'flex',
                alignItems: 'center',
                marginRight: 5
            },
            cardsSection: {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
            },
            log: {
                padding: '0 .5% 1%',
                marginLeft: '1%',
                boxSizing: 'border-box',
                boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
                backgroundColor: 'white',
                overflow: 'auto',
                minWidth: 170,
            }
        }
    }

    componentDidMount() {
        fetch('/game/watch', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + Auth.getToken()
            },
            method: "POST",
            body: JSON.stringify({creatorUsername: this.props.params.username})
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data.state);
            this.setState({response: data.state});
        })
    }

    renderCardSection(title, cardArray, sort = false) {
        if (sort) {
            cardArray = _.sortBy(cardArray, ['symbol', 'number']);
        }
        return (
            <div style={{...this.styles.section, ...this.styles.cardsSection}} key={title}>
                <span style={this.styles.title}>{title}</span>
                {
                    cardArray.map((card, index) =>
                        <div style={this.styles.card} key={index}>
                            <label>{new Card(card.symbol, card.number).stringify().short}</label>
                            <CardSymbol symbol={card.symbol} containerSize={12} padding={0.01}/>
                        </div>
                    )
                }
            </div>
        )
    }

    renderWarnings(data) {
        let playersCards = [];
        let total = 0;
        Object.keys(data.players).forEach((user, index) => {
            playersCards.push(...data.players[user].cards);
            total += data.players[user].cards.length;
        });
        let stacks = [...data.openStack, ...data.drawStack];
        let intersection = _.intersection(playersCards, stacks);
        if (intersection.length > 0) {
            return this.renderCardSection('intersection', intersection);
        }

        total += data.openStack.length;
        total += data.drawStack.length;
        if (total !== data.rules.deckNumber*52) {
            return <span>{total}</span>
        }
    }

    get scores(){
        const data = Object.assign({}, this.state.response);
        if(data.scores && data.scores.length){
            return data.scores;
        }
        let scores = [];
        Object.keys(data.players).forEach((user)=> {
            scores.push({username: user, score: 0});
        });
        return [scores];
    }

    render() {
        if (!this.state.response) return null;
        const data = Object.assign({}, this.state.response);
        data.logs.map((log) => log.card ? log.card = new Card(log.card) : log);
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.general}>
                    <div style={this.styles.section}>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>State</span>
                            <span>{data.status}</span>
                        </div>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>On move</span>
                            <span>{data.playerOnMove}</span>
                        </div>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>Direction</span>
                            <span>{data.direction}</span>
                        </div>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>Hand starter</span>
                            <span>{data.handStarter}</span>
                        </div>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>Players</span>
                            <div style={this.styles.users}>
                                {
                                    Object.keys(data.players).map((user, index) =>
                                        <div key={user} style={this.styles.user}>
                                            <span style={this.styles.userProp}>{user}</span>
                                            <span style={this.styles.userProp}>{data.players[user].online}</span>
                                            <span style={this.styles.userProp}>{data.players[user].cards.length}</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div style={this.styles.subsection}>
                            {this.renderWarnings(data)}
                        </div>
                    </div>
                    <div style={this.styles.section}>
                        <h3 style={this.styles.title}>Rules</h3>
                        <Rules rules={data.rules}/>
                    </div>
                    <div>
                        <Scores height={250}
                                scores={this.scores}/>
                    </div>
                </div>
                <div style={this.styles.cardsContainer}>
                    {this.renderCardSection('open stack', data.openStack)}
                    {this.renderCardSection('draw stack', data.drawStack)}
                    {
                        Object.keys(data.players).map((user, index) =>
                            this.renderCardSection(user, data.players[user].cards, true)
                        )
                    }
                </div>
                <div style={this.styles.log}>
                    <Log logs={data.logs} alwaysDisplayUsername/>
                </div>
            </div>
        );
    }
}
export default Watcher;

Watcher.defaultProps = {};

Watcher.propTypes = {};