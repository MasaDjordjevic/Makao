import React from 'react';
import {blackColor, redColor, isBlack} from './Card'

class CardSymbol extends React.Component {
    render() {

        const circleSize = this.props.containerSize;
        const circleSignSize = circleSize * 0.7;
        const headerCircleSignStyle = {
            lineHeight: circleSize + "px",
            fontSize: circleSignSize + "px",
            margin: "auto",
            fontFamily: "monospace",
            fontWeight: "600",
            color: isBlack(this.props.symbol) ? blackColor : redColor,
        };
        if (this.props.lineHeight) {
            headerCircleSignStyle.lineHeight = this.props.lineHeight + "px";
        }
        if (this.props.margin) {
            headerCircleSignStyle.marginRight = this.props.margin + "px";
            headerCircleSignStyle.marginLeft = this.props.margin + "px";
        }
        var cardSymbol;
        switch (this.props.symbol) {
            case "spades":
                cardSymbol = <span style={headerCircleSignStyle}>&spades;</span>;
                break;
            case "diamonds":
                cardSymbol = <span style={headerCircleSignStyle}>&diams;</span>;
                break;
            case "clubs":
                cardSymbol = <span style={headerCircleSignStyle}>&clubs;</span>;
                break;
            case "hearts":
                cardSymbol = <span style={headerCircleSignStyle}>&hearts;</span>;
                break;
            default:
        }

        return (
            cardSymbol
        );
    }
}

export default CardSymbol;