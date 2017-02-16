import React from 'react';
import Auth from '../Auth';
import Rules from './Lobby/Rules'
import CardSymbol from './Card/CardSymbol';
import Card from './Card/Card';
import _ from 'lodash';

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
            },
            general: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
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
        if(sort){
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

    renderWarnings(data){
        let playersCards = [];
        Object.keys(data.players).forEach((user,index)=> {
            playersCards.push(...data.playersCards[user]);
        });
        let stacks = [...data.openStack, ...data.drawStack];
        let intersection = _.intersection(playersCards, stacks);
        if(intersection.length > 0){
            return this.renderCardSection('intersection', intersection);
        }
    }

    render() {
        if (!this.state.response) return null;
        const data = Object.assign({}, this.state.response);
        return (
            <div style={{...this.styles.container, ...this.props.style}}>
                <div style={this.styles.general}>
                    <div style={this.styles.section}>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>State</span>
                            <span>{data.state}</span>
                        </div>
                        <div style={this.styles.subsection}>
                            <span style={this.styles.title}>Players</span>
                            <div style={this.styles.users}>
                                {
                                    Object.keys(data.players).map((user, index) =>
                                        <div key={user} style={this.styles.user}>
                                            <span style={this.styles.userProp}>{user}</span>
                                            <span style={this.styles.userProp}>{data.players[user].online}</span>
                                            <span style={this.styles.userProp}>{data.players[user].cardNumber}</span>
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
                </div>
                <div style={this.styles.cardsContainer}>
                    {this.renderCardSection('open stack', data.openStack)}
                    {this.renderCardSection('draw stack', data.drawStack)}
                    {
                        Object.keys(data.playersCards).map((user, index) =>
                            this.renderCardSection(user, data.playersCards[user], true)
                        )
                    }
                </div>
            </div>
        );
    }
}
export default Watcher;

Watcher.defaultProps = {};

Watcher.propTypes = {};