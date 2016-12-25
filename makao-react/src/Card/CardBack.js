/**
 * Created by Masa on 23-Dec-16.
 */
import React from 'react';
import Radium from 'radium';
import {redColor, blackColor, getCardWidth, getCardBorderRadius} from './common';
import CardSymbol from './CardSymbol';

class CardBack extends React.Component {
    get cardWidth() {
        return getCardWidth(this.props.cardHeight);
    }

    get circleSize() {
        return this.cardWidth * 0.7
    }

    get style() {
        const cardHeight = this.props.cardHeight;
        const border = '2px grey solid';
        const cardBorderSize = cardHeight / 31;
        const cardBorderRadius = getCardBorderRadius(cardHeight);
        return {
            container: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: this.cardWidth,
                height: cardHeight,
                borderRadius: cardBorderRadius,
                overflow: "hidden",
                boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                border: cardBorderSize + 'px white solid',
                boxSizing: 'border-box',
                position: 'relative',
            },
            half: {
                width: '100%',
                height: this.props.cardHeight / 2,
            },
            upperHalf: {
                backgroundColor: redColor,
            },
            bottomHalf: {
                backgroundColor: blackColor,
            },
            center: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "absolute",
                width: this.circleSize,
                height: this.circleSize,
                top: this.props.cardHeight / 4,
                left: (this.cardWidth - 2 * cardBorderSize) / 2 - this.circleSize / 2,
                border: "none",
                borderRadius: "50%",
                backgroundColor: "white",
                transform: 'rotate(45deg)'
            },
            circle: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: 'center',
            },
            verticalSeparator: {
                width: 1,
                height: this.circleSize / 2 * 0.7,
                backgroundColor: '#e9edef'
            },
            horizontalSeparator: {
                height: 1,
                width: this.circleSize * 0.7,
                backgroundColor: '#e9edef'
            },
            circleHalf: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-between",
                alignItems: 'center',
                width: "50%",
                height: '100%',
            },
            circleFourth: {
                width: '25%',
                height: '25%',
                transform: 'rotate(-45deg)'
            },
            borderRight: {
                borderRight: border,
            },
            borderBottom: {
                borderBottom: border,
            }

        }
    }

    render() {
        const symbolSize = this.circleSize * 0.25;
        return (
            <div style={this.style.container}>
                <div style={[this.style.half, this.style.upperHalf]}></div>
                <div style={this.style.center}>
                    <div style={this.style.circle}>
                        <div style={this.style.circleHalf}>
                            <div style={this.style.circleFourth}>
                                <CardSymbol containerSize={symbolSize} symbol="hearts"/>
                            </div>
                            <div style={this.style.verticalSeparator}>
                            </div>
                            <div style={this.style.circleFourth}>
                                <CardSymbol containerSize={symbolSize} symbol="spades"/>
                            </div>
                        </div>
                        <div style={this.style.horizontalSeparator}>
                        </div>
                        <div style={this.style.circleHalf}>
                            <div style={this.style.circleFourth}>
                                <CardSymbol containerSize={symbolSize} symbol="clubs"/>
                            </div>
                            <div style={this.style.verticalSeparator}>
                            </div>
                            <div style={this.style.circleFourth}>
                                <CardSymbol containerSize={symbolSize} symbol="diamonds"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={[this.style.half, this.style.bottomHalf]}></div>
            </div>
        );
    }
}

export default Radium(CardBack);