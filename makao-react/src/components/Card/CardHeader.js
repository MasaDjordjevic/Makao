/**
 * Created by Masa on 22-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import {font} from './common';
import Card from './Card';
import CardSymbol from './CardSymbol';
import { blueGrey50, red50} from 'material-ui/styles/colors'
import {isBlack} from './common';

class CardHeader extends React.Component {
    get circleSize() {
        return this.props.cardHeight / 5 / 2;
    }

    get styles() {
        const cardHeight = this.props.cardHeight;
        let signPadding = !this.props.offset || this.props.offset > 60 ? 16 : this.props.offset / 10;
        if (cardHeight < 160) {
            signPadding = cardHeight / 16;
        }
        const circleStyle = {
            display: "block",
            position: "absolute",
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            textAlign: 'center'
        };
        return {
            headerTextContainerStyle: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: "3%",
            },
            numberStyle: {
                width: this.circleSize,
                color: "white",
                fontSize: this.circleSize,
                fontFamily: "Dosis",
                fontWeight: "200",
                textAlign: "center",
                marginLeft: signPadding
            },
            textStyle: {
                color: "white",
                fontSize: cardHeight / 5 / 6,
                fontFamily: font,
                fontWeight: "400",
                marginRight: "20px",
                marginTop: "10px",
                textAlign: "center",
            },

            headerCircleStyle: {
                ...circleStyle, ...{
                    left: signPadding,
                    backgroundColor: this.props.card.jackSymbol ?
                        (isBlack(this.props.card.symbol) ? blueGrey50 : red50) : 'white',

                }
            },
            headerCircleRight: {
                ...circleStyle, ...{
                    right: signPadding,
                    backgroundColor: "white",

                }
            }
        }
    }

    render() {
        return (
            <div>
                <div style={this.styles.headerTextContainerStyle}>
                    <span style={this.styles.numberStyle}>{this.props.card.stringify().short}</span>
                    <span style={this.styles.textStyle}>{this.props.card.stringify().long.toUpperCase()}
                        &nbsp;OF&nbsp;{this.props.card.symbol.toUpperCase()}</span>
                </div>
                <div style={this.styles.headerCircleStyle}>
                    <CardSymbol containerSize={this.circleSize} symbol={this.props.card.symbol}/>
                </div>
                {
                    this.props.card.jackSymbol &&
                    <div style={this.styles.headerCircleRight}>
                        <CardSymbol containerSize={this.circleSize * 1.2}
                                    symbol={this.props.card.jackSymbol || 'spades'}/>
                    </div>
                }

            </div>
        );
    }
}

CardHeader.propTypes = {
    card: React.PropTypes.instanceOf(Card),
    cardHeight: React.PropTypes.number.isRequired,
    offset: React.PropTypes.number,
};

export default Radium(CardHeader);