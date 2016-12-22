import React from 'react';
import Radium from 'radium';
import {blackColor, redColor, isBlack} from './Card'

class CardSymbol extends React.Component {
    getStyles() {
        const circleSize = this.props.containerSize;
        const circleSignSize = circleSize * 0.7;
        var style = {
            lineHeight: circleSize + "px",
            fontSize: circleSignSize + "px",
            margin: "auto",
            fontFamily: "monospace",
            fontWeight: "600",
            color: isBlack(this.props.symbol) ? blackColor : redColor,
            ':hover': {
                backgroundColor: "red",
            }
        };
        if (this.props.lineHeight) {
            style.lineHeight = this.props.lineHeight + "px";
        }
        if (this.props.margin) {
            style.marginRight = this.props.margin + "px";
            style.marginLeft = this.props.margin + "px";
        }

        return style;
    }

    render() {
        let charCode;
        switch (this.props.symbol) {
            case "spades": charCode = 9824; break;
            case "diamonds": charCode = 9830; break;
            case "clubs": charCode = 9827; break;
            case "hearts": charCode = 9829; break;
            default:
        }

        return (
            <span style={this.getStyles()}>{String.fromCharCode(charCode)}</span>
        );
    }
}

export default Radium(CardSymbol);